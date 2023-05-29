export const toDateFromLocaleDateString = (dateString: string) => {
	const parts = dateString.split('/').map((i) => parseInt(i, 10).toString())
	const day = parts[0]
	const year = parts[1]
	const month = parts[2]
	return `${year}-${month.length > 1 ? month : `0${month}`}-${day.length > 1 ? day : `0${day}`}`
}

export const displayDate = (task: { due?: string }) => {
	try {
		const check = task?.due
		if (check && check.length > 0) {
			return check
		}
		return 'No Due Date'
	} catch (e) {
		return 'No Due Date'
	}
}
