import { registerCollection, ProtectedString, ProtectedStringProperties } from '../lib'
import { RundownId } from './Rundowns'
import { IBlueprintSegmentDB } from '@sofie-automation/blueprints-integration'
import { SegmentNote } from '../api/notes'
import { createMongoCollection } from './lib'
import { registerIndex } from '../database'
import { MongoFieldSpecifierOnes } from '../typings/meteor'

/** A string, identifying a Segment */
export type SegmentId = ProtectedString<'SegmentId'>
/** A "Title" in NRK Lingo / "Stories" in ENPS Lingo. */

export enum SegmentOrphanedReason {
	/** Segment is deleted from the NRCS but we still need it */
	DELETED = 'deleted',
	/** Segment should be hidden, but it is still playing */
	HIDDEN = 'hidden',
}

// TV 2 uses this for the not-yet-contributed MiniShelf
export const orphanedHiddenSegmentPropertiesToPreserve: MongoFieldSpecifierOnes<DBSegment> = {}

export interface DBSegment extends ProtectedStringProperties<IBlueprintSegmentDB, '_id'> {
	_id: SegmentId
	/** Position inside rundown */
	_rank: number
	/** ID of the source object in the gateway */
	externalId: string
	/** Timestamp when the externalData was last modified */
	externalModified: number
	/** The rundown this segment belongs to */
	rundownId: RundownId

	/** Is the segment in an unsynced state? */
	orphaned?: SegmentOrphanedReason

	/** Holds notes (warnings / errors) thrown by the blueprints during creation */
	notes?: Array<SegmentNote>
}
export type Segment = DBSegment

export const Segments = createMongoCollection<Segment, DBSegment>('segments')
registerCollection('Segments', Segments)

registerIndex(Segments, {
	rundownId: 1,
	_rank: 1,
})
