import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/tower-of-precision/',         // <-- your repo name

  plugins: [react()],
})
