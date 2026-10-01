import { favorites } from '../services/favorites.mjs';

import {
  formatNumber,
  formatDate,
  escapeHtml,
} from '../utils/format.mjs';


const save = (type, item, id) => `
  <button
    class="save-button ${
      favorites.isSaved(type, id) ? 'is-saved' : ''
    }"
    data-favorite
    data-type="${type}"
    data-item='${JSON.stringify(item).replace(/'/g, '&#39;')}'
    aria-label="Save item"
  >
    ${favorites.isSaved(type, id) ? 'Saved' : 'Save'}
  </button>
`;


export function renderDeveloperCard(u) {
  return `
    <article class="card card--developer">
      <img
        class="avatar"
        src="${u.avatar_url}"
        alt="${escapeHtml(u.login)} avatar"
        loading="lazy"
      >

      <div class="card__body">
        <div class="card__top">
          <div>
            <h3>
              <a
                href="developer.html?username=${encodeURIComponent(u.login)}"
              >
                ${escapeHtml(u.login)}
              </a>
            </h3>

            <span class="muted">
              ${escapeHtml(u.type || 'User')}
            </span>
          </div>

          ${save('developers', u, u.login)}
        </div>

        <div class="stats">
          <span>
            ${formatNumber(u.followers || 0)} followers
          </span>

          <span>
            ${formatNumber(u.public_repos || 0)} repos
          </span>
        </div>

        <a
          class="text-link"
          href="${u.html_url}"
          target="_blank"
          rel="noopener"
        >
          GitHub ↗
        </a>
      </div>
    </article>
  `;
}


export function renderRepositoryCard(r) {
  return `
    <article class="card">
      <div class="card__top">
        <div>
          <h3>
            <a
              href="${r.html_url}"
              target="_blank"
              rel="noopener"
            >
              ${escapeHtml(r.name)}
            </a>
          </h3>

          <span class="muted">
            ${escapeHtml(r.owner?.login || '')}
          </span>
        </div>

        ${save('repositories', r, r.id)}
      </div>

      <p>
        ${escapeHtml(
          r.description || 'No description provided.'
        )}
      </p>

      <div class="tag-list">
        <span class="tag">
          ${escapeHtml(r.language || 'Unknown')}
        </span>

        <span class="muted">
          ★ ${formatNumber(r.stargazers_count || 0)}
        </span>

        <span class="muted">
          ⑂ ${formatNumber(r.forks_count || 0)}
        </span>
      </div>

      <small class="muted">
        Updated ${formatDate(r.updated_at)}
      </small>
    </article>
  `;
}


export function renderArticleCard(a) {
  return `
    <article class="card article-card">
      ${
        a.cover_image
          ? `
            <img
              class="article-cover"
              src="${a.cover_image}"
              alt=""
              loading="lazy"
            >
          `
          : ''
      }

      <div class="card__body">
        <div class="card__top">
          <span class="eyebrow">
            #${escapeHtml(a.tag_list?.[0] || 'technology')}
          </span>

          ${save('articles', a, a.id)}
        </div>

        <h3>
          <a
            href="${a.url}"
            target="_blank"
            rel="noopener"
          >
            ${escapeHtml(a.title)}
          </a>
        </h3>

        <p>
          ${escapeHtml(a.description || '')}
        </p>

        <div class="article-meta">
          <span>
            ${escapeHtml(
              a.user?.name ||
              a.user?.username ||
              'Dev.to'
            )}
          </span>

          <span>
            ${a.reading_time || 1} min read
          </span>

          <span>
            ♥ ${formatNumber(a.public_reactions_count || 0)}
          </span>
        </div>
      </div>
    </article>
  `;
}