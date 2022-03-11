import { StudioId } from '@sofie-automation/corelib/dist/dataModel/Ids'
import { IngestWorkerChild } from './child'
import { InvalidateWorkerDataCache } from '../caches'
import { WorkerParentBase, WorkerParentBaseOptions } from '../parent-base'
import { AnyLockEvent } from '../locks'
import { getIngestQueueName } from '@sofie-automation/corelib/dist/worker/ingest'
import { Promisify, threadedClass, ThreadedClassManager } from 'threadedclass'
import { FastTrackTimelineFunc, LogLineWithSourceFunc } from '../../main'
import { addThreadNameToLogLine } from '../../logging'

export class IngestWorkerParent extends WorkerParentBase {
	readonly #thread: Promisify<IngestWorkerChild>

	private constructor(baseOptions: WorkerParentBaseOptions, thread: Promisify<IngestWorkerChild>) {
		super(baseOptions)

		this.#thread = thread
	}

	static async start(
		baseOptions: Omit<WorkerParentBaseOptions, 'queueName' | 'prettyName'>,
		mongoUri: string,
		logLine: LogLineWithSourceFunc,
		fastTrackTimeline: FastTrackTimelineFunc | null
	): Promise<IngestWorkerParent> {
		const queueName = getIngestQueueName(baseOptions.studioId)
		const prettyName = queueName

		const emitLockEvent = async (e: AnyLockEvent) => baseOptions.locksManager.handleLockEvent(queueName, e)
		const logLineInner = async (msg: unknown) => logLine(addThreadNameToLogLine(queueName, msg))

		const workerThread = await threadedClass<IngestWorkerChild, typeof IngestWorkerChild>(
			'./child',
			'IngestWorkerChild',
			[emitLockEvent, baseOptions.jobManager.queueJob, logLineInner, fastTrackTimeline],
			{
				instanceName: `Ingest: ${baseOptions.studioId}`,
			}
		)

		// create and start the worker
		const parent = new IngestWorkerParent({ ...baseOptions, queueName, prettyName }, workerThread)

		parent.registerStatusEvents(workerThread)

		parent.startWorkerLoop(mongoUri)
		return parent
	}

	protected async initWorker(mongoUri: string, dbName: string, studioId: StudioId): Promise<void> {
		return this.#thread.init(mongoUri, dbName, studioId)
	}
	protected async invalidateWorkerCaches(invalidations: InvalidateWorkerDataCache): Promise<void> {
		return this.#thread.invalidateCaches(invalidations)
	}
	protected async runJobInWorker(name: string, data: unknown): Promise<any> {
		return this.#thread.runJob(name, data)
	}
	protected async terminateWorkerThread(): Promise<void> {
		return ThreadedClassManager.destroy(this.#thread)
	}
	protected async restartWorkerThread(): Promise<void> {
		return ThreadedClassManager.restart(this.#thread, true)
	}
	public async workerLockChange(lockId: string, locked: boolean): Promise<void> {
		return this.#thread.lockChange(lockId, locked)
	}
}