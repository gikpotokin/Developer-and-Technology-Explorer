export function validateSearch(value, target) {
    if (!value || value.trim().length < 2) {
        const element =
            typeof target === 'string'
                ? document.querySelector(target)
                : target;

        if (element) {
            element.innerHTML = `
                <div class="inline-error" role="alert">
                    Please enter at least two characters to search.
                </div>
            `;
        }

        return false;
    }

    return true;
}