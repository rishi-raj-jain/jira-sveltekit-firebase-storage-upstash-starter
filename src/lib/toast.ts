export const showToast = (message: string, time: number = 1000) => {
	try {
		if (typeof window !== 'undefined') {
			if (!window.toasts) {
				window.toasts = {}
			}
			let randomToastID = Math.random().toString(16).slice(2)
			let div = document.createElement('div')
			div.className = 'w-[75vw] md:w-[420px] z-[1000] bg-white fixed right-10 bottom-10 py-4 px-6 rounded shadow border flex flex-col text-sm text-black'
			div.id = `toast-${randomToastID}`
			div.innerHTML = message
			document.body.insertAdjacentElement('beforeend', div)
			let timeOutForThisToast = setTimeout(() => {
				const selector = document.getElementById(`toast-${randomToastID}`)
				if (selector) {
					selector.remove()
					if (window.toasts) {
						clearTimeout(window.toasts[randomToastID])
						delete window.toasts[randomToastID]
					}
				}
			}, time)
			window.toasts[randomToastID] = timeOutForThisToast
		}
	} catch (e) {
		const error = e.message || e.toString()
		console.log(error)
	}
}
