import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        developers: 'developers.html',
        developer: 'developer.html',
        repositories: 'repositories.html',
        articles: 'articles.html',
        favorites: 'favorites.html',
        about: 'about.html',
      },
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4173,
    strictPort: false,
  },
});
