import { v4 as uuidv4 } from 'uuid'
import { json } from '@sveltejs/kit'
import { isAuth } from '@/src/lib/auth'
import { initializeApp } from 'firebase/app'
import type { RequestEvent } from './$types'
import { getTask, updateTask } from '@/src/lib/issues'
import { ratelimit } from '@/src/lib/upstash/ratelimit'
import fireBaseConfig from '../../../../firebase-adminsdk.json'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'

export async function POST(event: RequestEvent) {
	// Rate limit 2 uploads per minute
	const ratelimitUpload = ratelimit(2, '60 s')
	const user = await isAuth(event)
	if (!user) {
		return new Response(undefined, {
			status: 403
		})
	}
	if (user.session.user?.email) {
		const app = initializeApp(fireBaseConfig)
		const storage = getStorage(app)
		const data = await event.request.formData()
		const taskID = data.get('taskID')
		if (!taskID) {
			return new Response(
				JSON.stringify({
					code: 0,
					error: '<span>No Task ID was supplied with the request.</span> <span class="mt-1 text-xs text-gray-500">Report an issue with the current URL that you are on.</span>'
				}),
				{
					status: 403,
					headers: {
						'content-type': 'application/json'
					}
				}
			)
		}
		const file = data.get('file')
		if (!file) {
			return new Response(JSON.stringify({ code: 0, error: 'No File Provided' }), {
				status: 403,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
		const result = await ratelimitUpload.limit(`${user.session.user.email}_${taskID}`)
		if (!result.success) {
			return new Response(JSON.stringify({ code: 0, error: `You can't upload more than 2 files per issue per minute.` }), {
				status: 403,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
		if (file.size > 5 * 1024 * 1024) {
			return new Response(JSON.stringify({ code: 0, error: 'File size exceeds the limit of 5 MB.' }), {
				status: 400,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
		try {
			const fileId = uuidv4()
			if (!(file instanceof File)) return
			const storageRef = ref(storage, `uploads/${fileId}/${file.name}`)
			const fileBuffer = await file.arrayBuffer()
			const { metadata } = await uploadBytes(storageRef, new Uint8Array(fileBuffer))
			const { fullPath } = metadata
			if (!fullPath) {
				return new Response(
					JSON.stringify({
						code: 0,
						error: `<span>There was some error while uploading the file.</span> <span class="mt-1 text-xs text-gray-500">Report an issue with the current URL that you are on and with the code XXX.</span>`
					}),
					{
						status: 403,
						headers: {
							'content-type': 'application/json'
						}
					}
				)
			}
			const { code, ...taskValues } = await getTask(taskID)
			if (code === 1) {
				if (taskValues) {
					if (taskValues.hasOwnProperty('files')) {
						taskValues['files'].push(`https://storage.googleapis.com/${storageRef.bucket}/${storageRef.fullPath}`)
					} else {
						taskValues['files'] = [`https://storage.googleapis.com/${storageRef.bucket}/${storageRef.fullPath}`]
					}
				}
				await updateTask(taskValues, taskID)
			}
			return json({
				code: 1,
				message: 'Uploaded Successfully'
			})
		} catch (error) {
			return new Response(JSON.stringify({ code: 0, error: error.message || error.toString() }), {
				status: 403,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
	}
	return new Response(undefined, {
		status: 403
	})
}

export async function GET(event: RequestEvent) {
	if (!(await isAuth(event))) {
		return new Response(undefined, {
			status: 403
		})
	}
	const url = event.url
	const image = url.searchParams.get('image')
	if (image) {
		try {
			const app = initializeApp(fireBaseConfig)
			const storage = getStorage(app)
			const fileRef = ref(storage, image)
			const imagePublicURL = await getDownloadURL(fileRef)
			return json({ code: 1, image: imagePublicURL })
		} catch (error) {
			return new Response(JSON.stringify({ code: 0, error: error.message || error.toString() }), {
				status: 500,
				headers: {
					'content-type': 'application/json'
				}
			})
		}
	}
	return new Response(JSON.stringify({ code: 0, error: 'Invalid Request.' }), {
		status: 400,
		headers: {
			'content-type': 'application/json'
		}
	})
}
