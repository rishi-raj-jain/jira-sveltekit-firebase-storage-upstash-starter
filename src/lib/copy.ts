import { showToast } from './toast'

function fallbackCopyTextToClipboard(text: string) {
	var textArea = document.createElement('textarea')
	textArea.value = text
	textArea.style.top = '0'
	textArea.style.left = '0'
	textArea.style.position = 'fixed'
	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()
	try {
		document.execCommand('copy')
	} catch (err) {
		console.error(err)
	}
	document.body.removeChild(textArea)
}

export const copyTextToClipboard = (text: string, message?: string) => {
	if (!text) return
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text)
		showToast(message ?? 'Copied to clipboard!')
		return
	}
	navigator.clipboard.writeText(text).then(
		function () {
			showToast(message ?? 'Copied to clipboard!')
		},
		function (err) {
			console.error(err)
		}
	)
}
