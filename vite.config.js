import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Default is root ("/") for local dev and most hosts.
  // For GitHub Pages project sites (served from a subpath like /EXAM-3/),
  // pass --base=/YOUR-REPO-NAME/ on the build command instead of editing this file.
  base: '/ETS1',
})
