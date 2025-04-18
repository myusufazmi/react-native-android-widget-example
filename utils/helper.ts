export function textToChar(text: string) {
	const words = text?.split(/\s/)
	if (words?.length >= 2) {
		return words[0].slice(0, 1).toUpperCase() + words[1].slice(0, 1).toUpperCase()
	} else {
		return words.reduce((response: any, word: any) => response + word.slice(0, 1), '')
	}
}

export function formatToUnits(number: number, precision: number = 2) {
	const abbrev = ['', 'k', 'm', 'b', 't']
	const unrangifiedOrder = Math.floor(Math.log10(Math.abs(number)) / 3)
	const order = Math.max(0, Math.min(unrangifiedOrder, abbrev.length - 1))
	const suffix = abbrev[order]

	return (number / Math.pow(10, order * 3)).toFixed(precision) + suffix
}
