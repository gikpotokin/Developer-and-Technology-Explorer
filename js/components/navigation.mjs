export function initNavigation() {
    const header = document.querySelector('#site-header');

    if (!header) return;

    const page = document.body.dataset.page;

    const links = [
        ['home', 'Home', 'index.html'],
        ['developers', 'Developers', 'developers.html'],
        ['repositories', 'Repositories', 'repositories.html'],
        ['articles', 'Articles', 'articles.html'],
        ['favorites', 'Favorites', 'favorites.html'],
        ['about', 'About', 'about.html']
    ];

    header.innerHTML = `
        <nav class="nav" aria-label="Primary navigation">
            <div class="container nav__inner">

                <a class="brand" href="index.html">
                    <span class="brand__mark">&lt;/&gt;</span>
                    <span>DTX</span>
                </a>

                <button
                    class="menu-button"
                    aria-expanded="false"
                    aria-controls="nav-menu"
                    aria-label="Open menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div id="nav-menu" class="nav__links">
                    ${links
                        .map(
                            ([key, label, url]) => `
                                <a
                                    class="${page === key ? 'active' : ''}"
                                    href="${url}"
                                    ${page === key ? 'aria-current="page"' : ''}
                                >
                                    ${label}
                                </a>
                            `
                        )
                        .join('')}
                </div>

            </div>
        </nav>
    `;

    const button = header.querySelector('.menu-button');
    const menu = header.querySelector('#nav-menu');

    button.addEventListener('click', () => {
        const isOpen =
            button.getAttribute('aria-expanded') === 'true';

        const shouldOpen = !isOpen;

        button.setAttribute(
            'aria-expanded',
            String(shouldOpen)
        );

        menu.classList.toggle(
            'is-open',
            shouldOpen
        );

        document.body.classList.toggle(
            'menu-open',
            shouldOpen
        );
    });
}