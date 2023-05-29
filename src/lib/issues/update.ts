export async function updateTask(info: any, id: string) {
	try {
		const redis = (await import('../upstash/setup')).default
		if (id) {
			const task = await redis.hget('issues', id)
			if (task) {
				await redis.hset('issues', { [id]: info })
				return { code: 1, message: 'Updated Successfully' }
			}
		}
		return {
			code: 0,
			error: 'No such issue was found.'
		}
	} catch (e: any) {
		const error = e.message || e.toString()
		console.log(error)
		return {
			code: 0,
			error
		}
	}
}
