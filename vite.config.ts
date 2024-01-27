import million from 'million/compiler'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    // @ts-ignore
    plugins: [million.vite(), react()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData:
                    '@use "src/scss/_variables.scss" as *; @use "src/scss/_mixins.scss" as *;',
            },
        },
    },
})
