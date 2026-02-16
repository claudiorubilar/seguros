import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Carga las variables de entorno del archivo .env
    const env = loadEnv(mode, process.cwd(), ''); 
    
    return {
      // 'base: "./"' es la clave para Hostinger. 
      // Hace que todas las rutas sean relativas y funcionen en cualquier carpeta.
      base: '/insurcore/', 
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      
      plugins: [react()],
      
      // Mantenemos tu configuración de la API Key de Gemini
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      
      resolve: {
        alias: {
          // Ajustado para que el alias @ apunte a la carpeta src de forma estándar
          '@': path.resolve(__dirname, './src'),
        }
      },
      
      build: {
        // Carpeta de salida
        outDir: 'dist',
        // Comprimir assets para que cargue más rápido en la web
        assetsDir: 'assets',
        sourcemap: false,
        // Limpieza de logs de consola en producción para mayor privacidad
        minify: 'esbuild',
      }
    };
});