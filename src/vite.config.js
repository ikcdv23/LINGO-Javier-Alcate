import { defineConfig } from 'vite'; // <-- ¡La línea import que faltaba!
import laravel from 'laravel-vite-plugin'; // <-- ¡La otra línea import!

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
                'resources/css/game.css', // <-- Nuestra nueva línea
                'resources/js/game.js'    // <-- Nuestra nueva línea
            ],
            refresh: true,
        }),
    ],
    server: {
        host: '0.0.0.0', // <-- El bloque que ya teníamos para Docker
        hmr: {
            host: 'localhost',
        },
    },
});