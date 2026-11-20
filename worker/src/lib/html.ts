const ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

export function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (character) => ESCAPES[character] ?? character);
}

export function textToHtml(value: string): string {
	return escapeHtml(value).replace(/\n/g, '<br>');
}
