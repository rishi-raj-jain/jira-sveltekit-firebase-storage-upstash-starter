import { json } from '@sveltejs/kit'
import { isAuth } from '@/src/lib/auth'
import type { RequestEvent } from './$types'
import { ratelimit } from '@/src/lib/upstash/ratelimit'
import { createTask, getTask, getTasks, deleteTask, updateTask } from '@/src/lib/issues'

export async function GET(event: RequestEvent) {
	if (!(await isAuth(event))) {
		return new Response(undefined, {
			status: 403
		})
	}
	const url = event.url
	const idSearchParam = url.searchParams.get('id')
	if (idSearchParam) {
		const res = await getTask(idSearchParam)
		return json(res)
	} else if (url.searchParams.get('all')) {
		const res = await getTasks()
		return json(res)
	}
	return new Response(JSON.stringify({ code: 0, error: 'Invalid Request.' }), {
		status: 400,
		headers: {
			'content-type': 'application/json'
		}
	})
}

export async function POST(event: RequestEvent) {
	// Rate limit 5 issues creation per minute
	const ratelimitIssue = ratelimit(5, '60 s')
	const user = await isAuth(event)
	if (!user) {
		return new Response(undefined, {
			status: 403
		})
	}
	if (user.session.user?.email) {
		const result = await ratelimitIssue.limit(user.session.user.email)
		if (!result.success) {
			return new Response(JSON.stringify({ code: 0, error: `You can't create more than 5 issues per minute.` }), {
				status: 403,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
		const { info } = await event.request.json()
		const res = await createTask(info)
		return json(res)
	}
	return new Response(undefined, {
		status: 403
	})
}

export async function DELETE(event: RequestEvent) {
	if (!(await isAuth(event))) {
		return new Response(undefined, {
			status: 403
		})
	}
	const url = event.url
	const idSearchParam = url.searchParams.get('id')
	if (idSearchParam) {
		const res = await deleteTask(idSearchParam)
		return json(res)
	}
	return new Response(JSON.stringify({ code: 0, error: 'Invalid Request.' }), {
		status: 400,
		headers: {
			'content-type': 'application/json'
		}
	})
}

export async function PUT(event: RequestEvent) {
	if (!(await isAuth(event))) {
		return new Response(undefined, {
			status: 403
		})
	}
	const { info, id } = await event.request.json()
	const res = await updateTask(info, id)
	return json(res)
}
