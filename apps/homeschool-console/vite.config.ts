import { defineConfig } from 'vite'

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

export default defineConfig({
  // GitHub Pages project sites publish below /<repository>/; local development
  // and other static hosts continue to use the domain root.
  base: process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}/` : '/',
})
