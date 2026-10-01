const API = 'https://api.github.com';
async function request(path) {
  try {
    const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (response.status === 403 || response.status === 429) { const e=new Error('GitHub API rate limit reached. Please wait and try again.'); e.code='RATE_LIMIT'; throw e; }
    if (!response.ok) { const e=new Error(`GitHub API request failed (${response.status}).`); e.code='API_ERROR'; throw e; }
    return response.json();
  } catch(e) {
    if (e.code) throw e;
    const err=new Error('Network failure. Check your internet connection and try again.'); err.code='NETWORK_ERROR'; throw err;
  }
}
export const github = {
  searchUsers: q => request(`/search/users?q=${encodeURIComponent(q)}&per_page=12`),
  getUser: username => request(`/users/${encodeURIComponent(username)}`),
  getUserRepos: username => request(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`),
  searchRepositories: q => request(`/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=12`),
  getRepositoryLanguages: (owner,repo) => request(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`)
};
