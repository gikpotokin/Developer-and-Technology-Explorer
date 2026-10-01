export function showLoading(target, { type = 'cards', count = 3 } = {}) {
    if (!target) return;

    if (type === 'profile') {
        target.innerHTML = `
            <div class="loading-profile">
                <div class="skeleton skeleton-avatar"></div>

                <div>
                    <div class="skeleton skeleton-line wide"></div>
                    <div class="skeleton skeleton-line"></div>
                </div>
            </div>
        `;

        return;
    }

    if (type === 'list') {
        target.innerHTML = Array.from(
            { length: count },
            () => `
                <div class="skeleton-row">
                    <div class="skeleton skeleton-thumb"></div>

                    <div>
                        <div class="skeleton skeleton-line wide"></div>
                        <div class="skeleton skeleton-line"></div>
                    </div>
                </div>
            `
        ).join('');

        return;
    }

    target.innerHTML = `
        <div class="card-grid card-grid--${count > 3 ? '3' : '2'}">
            ${Array.from(
                { length: count },
                () => `
                    <div class="skeleton-card">
                        <div class="skeleton skeleton-image"></div>
                        <div class="skeleton skeleton-line wide"></div>
                        <div class="skeleton skeleton-line"></div>
                    </div>
                `
            ).join('')}
        </div>
    `;
}


export function showEmpty(
    target,
    title = 'Nothing found',
    message = 'Try another search.'
) {
    if (!target) return;

    target.innerHTML = `
        <div class="state">
            <div class="state__icon">⌕</div>
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
}


export function showError(target, error) {
    if (!target) return;

    const code = error?.code || 'API_ERROR';

    const errorMessages = {
        NETWORK_ERROR: [
            'Network failure',
            'Check your internet connection and try again.'
        ],

        API_ERROR: [
            'API request failed',
            error?.message || 'The service returned an error.'
        ],

        RATE_LIMIT: [
            'Rate limit reached',
            'Please wait before making another request.'
        ],

        INVALID_SEARCH: [
            'Invalid search',
            'Enter at least two characters.'
        ]
    };

    const [
        title,
        message
    ] = errorMessages[code] || [
        'Something went wrong',
        error?.message || 'Please try again.'
    ];

    target.innerHTML = `
        <div class="state state--error">
            <div class="state__icon">!</div>
            <h2>${title}</h2>
            <p>${message}</p>
        </div>
    `;
}