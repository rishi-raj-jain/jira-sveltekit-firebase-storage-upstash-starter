import path from 'path'
import preprocess from 'svelte-preprocess'
import vercel from '@sveltejs/adapter-vercel'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel({
			runtime: 'edge'
		}),
		alias: {
			'@/src': path.resolve('./src/')
		}
	},
	preprocess: [
		preprocess({
			postcss: true
		})
	]
}

export default config
