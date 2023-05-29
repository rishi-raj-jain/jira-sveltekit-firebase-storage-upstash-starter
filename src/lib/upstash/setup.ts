import { Redis } from '@upstash/redis'
import { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } from '$env/static/private'

const url = UPSTASH_REDIS_REST_URL
const token = UPSTASH_REDIS_REST_TOKEN

const redis = new Redis({
	url,
	token
})

export default redis
