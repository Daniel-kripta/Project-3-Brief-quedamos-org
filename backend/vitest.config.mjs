import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    fileParallelism: false // los dos archivos de test comparten la misma BD y se solapaban al ejecutarse en paralelo
  }
})
