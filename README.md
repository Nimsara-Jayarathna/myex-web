# React + Vite + Tailwind CSS + TypeScript Template

An opinionated starter kit that bundles modern tooling, strict TypeScript defaults, and production ready styling so you can focus on shipping features instead of wiring boilerplate.

## Why this template
- React 19 with StrictMode and Suspense ready entry points.
- Vite 7 for instant dev server startup, optimized builds, and zero-config preview.
- Tailwind CSS 4 preconfigured through the official Vite plugin for utility-first styling.
- ESLint 9 + TypeScript ESLint with React Hooks and Refresh rules for consistent code quality.
- Landing page sections (hero, features, stack, checklist) to illustrate composition patterns and responsive design with Tailwind.

## Quick start
1. Click **Use this template** on GitHub or clone the project locally.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   By default Vite serves the app on http://localhost:5173.

## Available scripts
- `npm run dev` - Start the Vite development server with hot module replacement.
- `npm run build` - Type-check the project and create a production build.
- `npm run preview` - Preview the production build locally.
- `npm run lint` - Lint the codebase using ESLint 9 and TypeScript ESLint.

## Folder layout
```
.
|-- public/
|   '-- favicon.svg
|-- src/
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   '-- vite-env.d.ts
|-- .env.example
|-- eslint.config.js
|-- index.html
|-- package.json
|-- tsconfig.app.json
|-- tsconfig.json
'-- tsconfig.node.json
```

## Environment variables
- Duplicate `.env.example` and rename it to `.env`, `.env.local`, or another Vite-compatible file name.
- Define variables with the `VITE_` prefix to expose them to the client bundle.
- Import values via `import.meta.env.VITE_<NAME>` inside your components or utilities.

## Customising the starter
- Replace the marketing copy and component structure in `src/App.tsx` with content that reflects your product.
- Extend the `src/components` tree with feature-specific folders (for example `components/dashboard`, `features/auth`, or `hooks`).
- Update `package.json` metadata (name, description, repository, author) before publishing.
- Adjust ESLint rules or Tailwind tokens to match your team conventions.
- Add integration tests (Vitest, Playwright, Cypress) once your domain logic comes into play.

## Deployment
1. Run `npm run build` to produce the optimized bundle in `dist/`.
2. Serve the `dist/` directory with your platform of choice (Vercel, Netlify, Render, static hosting, or a Node/Express server).
3. Set environment variables on your hosting provider to match the values defined locally.

## License
MIT - feel free to copy, adapt, and ship.
