import redis from './setup'
import { Ratelimit } from '@upstash/ratelimit'

export const ratelimit = {
	upload: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(2, '60s')
	}),
	issues: new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(5, '60s')
	})
}
