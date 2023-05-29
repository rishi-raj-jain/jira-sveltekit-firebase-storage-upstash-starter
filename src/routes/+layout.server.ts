import { isAuth } from '@/src/lib/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoadEvent } from './$types'

export const load = async (event: LayoutServerLoadEvent) => {
	const auth = await isAuth(event)
	if (!auth && event.url.pathname !== '/login') {
		throw redirect(302, '/login')
	}
	return auth
}
