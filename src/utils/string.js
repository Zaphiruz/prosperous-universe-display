export function camelCaseToReadable(str) {
	return str.replace(/([A-Z])/g, (match) => {
		return ' ' + match.toLowerCase();
	});
}