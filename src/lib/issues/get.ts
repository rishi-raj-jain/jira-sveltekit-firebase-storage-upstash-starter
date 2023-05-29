type Task = { [key: string]: any } | null

export async function getTask(id: string) {
	try {
		const redis = (await import('../upstash/setup')).default
		const task: Task = await redis.hget('issues', id)
		if (!task) {
			return {
				code: 0,
				error: 'No such issue found.'
			}
		}
		return { ...task, code: 1 }
	} catch (e: any) {
		const error = e.message || e.toString()
		console.log(error)
		return {
			code: 0,
			error
		}
	}
}

export async function getTasks() {
	try {
		const redis = (await import('../upstash/setup')).default
		const tasks = await redis.hkeys('issues')
		return { tasks, code: 1 }
	} catch (e: any) {
		const error = e.message || e.toString()
		console.log(error)
		return {
			code: 0,
			error
		}
	}
}
