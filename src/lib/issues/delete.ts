export async function deleteTask(id: string) {
	try {
		const redis = (await import('../upstash/setup')).default
		await redis.hdel('issues', id)
		return { code: 1, message: 'Deleted Succesfully!' }
	} catch (e: any) {
		const error = e.message || e.toString()
		console.log(error)
		return {
			code: 0,
			error
		}
	}
}
