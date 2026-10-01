# Developer & Technology Explorer (DTX)

API-powered web application for exploring GitHub developers, repositories,
programming languages, and Dev.to technology articles.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript
- ES Modules
- Vite
- GitHub REST API
- Dev.to API
- localStorage

No JavaScript framework is used.

## Requirements

- Node.js 18+ recommended
- npm

## Install

```bash
npm install
```

## Development

```bash
npm run start
```

Vite will print the local development URL.

## Production build

```bash
npm run build
```

The optimized production files are written to `dist/`.

## Preview production build

```bash
npm run preview
```

Open the URL printed by Vite.

## Lint

```bash
npm run lint
```

## Format

```bash
npm run format
```

## Project pages

- `/` — Home
- `/developers.html` — Developer search
- `/developer.html` — Developer profile
- `/repositories.html` — Repository explorer
- `/articles.html` — Technology articles
- `/favorites.html` — Saved items
- `/about.html` — About

## APIs

GitHub REST API:
https://api.github.com/

Dev.to API:
https://developers.forem.com/api/

## Week 5 scope

The project includes the Week 5 foundation from the project proposal:
responsive navigation, design-system variables and typography, loading and error
states, reusable API modules, reusable localStorage functions, CSS animations,
and the initial multi-page application structure.
