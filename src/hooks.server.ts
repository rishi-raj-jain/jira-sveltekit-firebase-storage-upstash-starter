import type { Handle } from '@sveltejs/kit'
import { SvelteKitAuth } from '@auth/sveltekit'
import Google from '@auth/core/providers/google'
import { GOOGLE_ID, GOOGLE_SECRET } from '$env/static/private'

export const handle = SvelteKitAuth({
	// @ts-ignore
	providers: [Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET })]
}) satisfies Handle
