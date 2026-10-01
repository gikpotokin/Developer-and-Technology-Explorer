const API='https://dev.to/api';
async function request(path) {
  try {
    const response=await fetch(`${API}${path}`,{headers:{Accept:'application/json'}});
    if(response.status===429){const e=new Error('Dev.to rate limit reached. Please wait and try again.');e.code='RATE_LIMIT';throw e}
    if(!response.ok){const e=new Error(`Dev.to API request failed (${response.status}).`);e.code='API_ERROR';throw e}
    return response.json();
  }catch(e){if(e.code)throw e;const err=new Error('Network failure. Check your internet connection and try again.');err.code='NETWORK_ERROR';throw err}
}
export const devto={getArticles:({tag,username,per_page=12,page=1}={})=>request(`/articles?per_page=${per_page}&page=${page}${tag?`&tag=${encodeURIComponent(tag)}`:''}${username?`&username=${encodeURIComponent(username)}`:''}`),getArticle:id=>request(`/articles/${encodeURIComponent(id)}`)};
