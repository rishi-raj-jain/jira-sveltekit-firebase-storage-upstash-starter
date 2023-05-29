import redis from './setup'
import { Ratelimit } from '@upstash/ratelimit'

type Unit = 'ms' | 's' | 'm' | 'h' | 'd'
type Duration = `${number} ${Unit}` | `${number}${Unit}`

export const ratelimit = (number: number, time: Duration) => {
	return new Ratelimit({
		redis: redis,
		limiter: Ratelimit.fixedWindow(number, time)
	})
}
