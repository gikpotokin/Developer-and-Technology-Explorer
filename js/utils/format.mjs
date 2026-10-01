export function formatNumber(n) {
    return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(Number(n) || 0);
}


export function formatDate(value) {
    if (!value) {
        return 'Unknown';
    }

    return new Intl.DateTimeFormat('en', {
        dateStyle: 'medium'
    }).format(new Date(value));
}


export function escapeHtml(value = '') {
    return String(value).replace(
        /[&<>"']/g,
        (character) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[character]
    );
}