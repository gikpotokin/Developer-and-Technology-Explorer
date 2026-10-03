const API = 'https://dev.to/api';

async function request(path) {
  try {
    const response = await fetch(`${API}${path}`, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (response.status === 429) {
      const error = new Error(
        'Dev.to rate limit reached. Please wait and try again.'
      );

      error.code = 'RATE_LIMIT';

      throw error;
    }

    if (!response.ok) {
      const error = new Error(
        `Dev.to API request failed (${response.status}).`
      );

      error.code = 'API_ERROR';

      throw error;
    }

    return response.json();
  } catch (error) {
    if (error.code) {
      throw error;
    }

    const networkError = new Error(
      'Network failure. Check your internet connection and try again.'
    );

    networkError.code = 'NETWORK_ERROR';

    throw networkError;
  }
}

export const devto = {
  getArticles: ({
    tag,
    username,
    per_page = 12,
    page = 1,
  } = {}) => {
    return request(
      `/articles?per_page=${per_page}&page=${page}` +
      `${tag ? `&tag=${encodeURIComponent(tag)}` : ''}` +
      `${username ? `&username=${encodeURIComponent(username)}` : ''}`
    );
  },

  getArticle: (id) => {
    return request(`/articles/${encodeURIComponent(id)}`);
  },
};