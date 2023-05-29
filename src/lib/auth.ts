import type { LayoutServerLoadEvent } from '../routes/$types'
import type { RequestEvent, ServerLoadEvent } from '@sveltejs/kit'

export const isAuth = async (event: LayoutServerLoadEvent | ServerLoadEvent | RequestEvent) => {
	const session = await event.locals.getSession()
	if (session?.user?.image) {
		return { session }
	}
	return false
}
