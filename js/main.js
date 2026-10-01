import { initNavigation } from './components/navigation.mjs';
import { showError, showLoading, showEmpty } from './components/feedback.mjs';
import { github } from './api/github.mjs';
import { devto } from './api/devto.mjs';
import { favorites } from './services/favorites.mjs';
import { formatNumber, formatDate, escapeHtml } from './utils/format.mjs';
import { validateSearch } from './utils/validation.mjs';
import { renderDeveloperCard, renderRepositoryCard, renderArticleCard } from './components/cards.mjs';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFooter();
  const page = document.body.dataset.page;
  ({ home: initHome, developers: initDevelopers, developer: initDeveloper, repositories: initRepositories,
     articles: initArticles, favorites: initFavorites }[page] || (() => {}))();
});

function initFooter() {
  const el = document.querySelector('#site-footer');
  if (el) el.innerHTML = `<footer class="footer"><div class="container footer__inner"><strong>DTX</strong><span>Developer & Technology Explorer</span><span>Built with GitHub + Dev.to APIs</span></div></footer>`;
}

async function initHome() {
  const form = document.querySelector('#home-search');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    const q = new FormData(form).get('q').trim();
    if (!validateSearch(q, '#home-search-message')) return;
    window.location.href = `developers.html?q=${encodeURIComponent(q)}`;
  });
  const devs = document.querySelector('#developer-highlights');
  const articles = document.querySelector('#latest-articles');
  const tags = document.querySelector('#popular-tags');
  showLoading(devs, { type: 'cards', count: 3 }); showLoading(articles, { type: 'list', count: 4 });
  try {
    const [d, a] = await Promise.all([github.searchUsers('developer'), devto.getArticles({ per_page: 4 })]);
    devs.innerHTML = d.items.slice(0,3).map(renderDeveloperCard).join('');
    articles.innerHTML = a.slice(0,4).map(renderArticleCard).join('');
    tags.innerHTML = ['javascript','python','webdev','programming','beginners','devops','css','ai'].map(t => `<a class="tag" href="articles.html?tag=${t}">#${t}</a>`).join('');
    bindFavoriteButtons();
  } catch (err) { showError(devs, err); showError(articles, err); }
}

async function initDevelopers() {
  const form = document.querySelector('#developer-search'), target = document.querySelector('#developer-results');
  const params = new URLSearchParams(location.search); const initial = params.get('q') || '';
  document.querySelector('#developer-query').value = initial;
  form?.addEventListener('submit', e => { e.preventDefault(); searchDevelopers(form, target); });
  if (initial) searchDevelopers(form, target);
}
async function searchDevelopers(form, target) {
  const q = new FormData(form).get('q').trim();
  if (!validateSearch(q, target)) return;
  const button = form.querySelector('button'); button.disabled = true; showLoading(target, {type:'cards', count:6});
  try {
    const data = await github.searchUsers(q);
    if (!data.items.length) return showEmpty(target, 'No developers found', `Try another username, name, or keyword.`);
    target.innerHTML = `<div class="results-meta">${formatNumber(data.total_count)} developers found</div><div class="card-grid card-grid--3">${data.items.map(renderDeveloperCard).join('')}</div>`;
    bindFavoriteButtons();
  } catch (err) { showError(target, err); } finally { button.disabled = false; }
}

async function initDeveloper() {
  const username = new URLSearchParams(location.search).get('username');
  const target = document.querySelector('#developer-profile');
  if (!username) return showError(target, {code:'INVALID_SEARCH', message:'No developer username was provided.'});
  showLoading(target, {type:'profile'});
  try {
    const [user, repos] = await Promise.all([github.getUser(username), github.getUserRepos(username)]);
    document.title = `${user.name || user.login} — DTX`;
    target.innerHTML = `<div class="profile-header">
      <img class="profile-avatar" src="${user.avatar_url}" alt="${escapeHtml(user.login)} avatar">
      <div><p class="eyebrow">@${escapeHtml(user.login)}</p><h1>${escapeHtml(user.name || user.login)}</h1><p>${escapeHtml(user.bio || 'No biography provided.')}</p>
      <div class="stats"><span><b>${formatNumber(user.public_repos)}</b> repos</span><span><b>${formatNumber(user.followers)}</b> followers</span><span><b>${formatNumber(user.following)}</b> following</span></div>
      <a class="btn btn--primary" href="${user.html_url}" target="_blank" rel="noopener">View GitHub profile ↗</a></div></div>
      <section class="section"><div class="section-heading"><h2>Repositories</h2></div><div class="card-grid card-grid--3">${repos.slice(0,12).map(renderRepositoryCard).join('')}</div></section>`;
    bindFavoriteButtons();
  } catch (err) { showError(target, err); }
}

async function initRepositories() {
  const form=document.querySelector('#repo-search'), target=document.querySelector('#repo-results');
  const params=new URLSearchParams(location.search); document.querySelector('#repo-query').value=params.get('q')||'';
  form.addEventListener('submit', e=>{e.preventDefault(); searchRepos(form,target)});
  if(params.get('q')) searchRepos(form,target);
}
async function searchRepos(form,target) {
  const q=new FormData(form).get('q').trim(), language=document.querySelector('#repo-language').value;
  if(!validateSearch(q,target)) return;
  const button=form.querySelector('button'); button.disabled=true; showLoading(target,{type:'cards',count:6});
  try {
    const data=await github.searchRepositories(`${q}${language ? ` language:${language}`:''}`);
    if(!data.items.length) return showEmpty(target,'No repositories found','Try a different technology or keyword.');
    target.innerHTML=`<div class="results-meta">${formatNumber(data.total_count)} repositories found</div><div class="card-grid card-grid--3">${data.items.map(renderRepositoryCard).join('')}</div>`;
    bindFavoriteButtons();
  } catch(err){showError(target,err)} finally{button.disabled=false}
}
async function initArticles() {
  const form=document.querySelector('#article-search'), target=document.querySelector('#article-results');
  const params=new URLSearchParams(location.search); document.querySelector('#article-query').value=params.get('q')||''; document.querySelector('#article-tag').value=params.get('tag')||'';
  form.addEventListener('submit',e=>{e.preventDefault(); searchArticles(form,target)});
  searchArticles(form,target);
}
async function searchArticles(form,target) {
  const q=new FormData(form).get('q').trim(), tag=new FormData(form).get('tag').trim();
  const button=form.querySelector('button'); button.disabled=true; showLoading(target,{type:'cards',count:6});
  try {
    const data=await devto.getArticles({tag:tag||undefined, per_page:12});
    const filtered=q ? data.filter(a=>`${a.title} ${a.description} ${(a.tag_list||[]).join(' ')}`.toLowerCase().includes(q.toLowerCase())) : data;
    if(!filtered.length)return showEmpty(target,'No articles found','Try another topic or tag.');
    target.innerHTML=`<div class="card-grid card-grid--3">${filtered.map(renderArticleCard).join('')}</div>`; bindFavoriteButtons();
  }catch(err){showError(target,err)}finally{button.disabled=false}
}
function initFavorites() {
  const target=document.querySelector('#favorites-content'), all=favorites.all();
  if(!all.developers.length&&!all.repositories.length&&!all.articles.length)return showEmpty(target,'No favorites yet','Save developers, repositories, and articles as you explore.');
  target.innerHTML = `${favSection('Developers',all.developers,renderDeveloperCard)}${favSection('Repositories',all.repositories,renderRepositoryCard)}${favSection('Articles',all.articles,renderArticleCard)}`;
  bindFavoriteButtons();
}
function favSection(title,items,renderer){return items.length?`<section class="section"><div class="section-heading"><h2>${title}</h2></div><div class="card-grid card-grid--3">${items.map(renderer).join('')}</div></section>`:''}
function bindFavoriteButtons(){document.querySelectorAll('[data-favorite]').forEach(b=>b.addEventListener('click',()=>{favorites.toggle(b.dataset.type,JSON.parse(b.dataset.item));b.classList.toggle('is-saved');b.textContent=b.classList.contains('is-saved')?'Saved':'Save';}))}
