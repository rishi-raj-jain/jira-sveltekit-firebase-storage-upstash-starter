export async function createTask(info: any) {
	try {
		const redis = (await import('../upstash/setup')).default
		const id = Math.random().toString().slice(2) + new Date().getUTCMilliseconds()
		await redis.hset('issues', { [id]: info })
		return { code: 1, id, message: 'Issue Created Succesfully ✅' }
	} catch (e: any) {
		const error = e.message || e.toString()
		console.log(error)
		return {
			code: 0,
			error
		}
	}
}
