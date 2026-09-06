import fs from 'node:fs/promises'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { PLAYABLE_LESSONS } from './src/quantum/curriculum.ts'

function lessonRoutePages() {
  let outputDirectory = ''

  return {
    name: 'quantum-lesson-route-pages',
    apply: 'build' as const,
    configResolved(config: { root: string; build: { outDir: string } }) {
      outputDirectory = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const indexPath = path.join(outputDirectory, 'index.html')
      const indexHtml = await fs.readFile(indexPath)
      await fs.writeFile(path.join(outputDirectory, '404.html'), indexHtml)

      await Promise.all(PLAYABLE_LESSONS.map(async lesson => {
        const routeDirectory = path.join(outputDirectory, lesson.slug!)
        await fs.mkdir(routeDirectory, { recursive: true })
        await fs.writeFile(path.join(routeDirectory, 'index.html'), indexHtml)
      }))
    },
  }
}

export default defineConfig({
  base: process.env.DEPLOY_BASE || '/',
  plugins: [react(), lessonRoutePages()],
})
