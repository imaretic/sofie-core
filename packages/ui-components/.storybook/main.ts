import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: ['@storybook/addon-essentials'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	docs: {
		autodocs: 'tag',
	},
	viteFinal: async (viteConfig) => {
		viteConfig.css = {
			...viteConfig.css,
			preprocessorOptions: {
				...viteConfig.css?.preprocessorOptions,
				scss: {
					...viteConfig.css?.preprocessorOptions?.scss,
					quietDeps: true,
				},
			},
		}
		return viteConfig
	},
}

export default config
