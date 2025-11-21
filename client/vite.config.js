import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Check if we're running on macOS and need esbuild-wasm
const isMacOS = process.platform === 'darwin';
const isMacOSARM64 = isMacOS && process.arch === 'arm64';
const isMacOSX64 = isMacOS && process.arch === 'x64';

console.log(`Running on: ${process.platform} (${process.arch})`);

// Ensure esbuild-wasm is used for cross-platform compatibility
if (isMacOS) {
    process.env.ESBUILD_WASM = 'true';
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        // Add esbuild optimization for cross-platform compatibility
        {
            name: 'esbuild-platform-fix',
            configResolved(config) {
                if (isMacOS) {
                    console.log(`🍎 macOS detected: ${isMacOSARM64 ? 'Apple Silicon (ARM64)' : 'Intel (x64)'}`);
                    // Force Vite to use a compatible esbuild configuration
                    config.optimizeDeps = {
                        ...config.optimizeDeps,
                        force: true,
                        include: ['react', 'react-dom', 'axios']
                    };
                }
            }
        }
    ],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
            }
        }
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            }
        },
        // Optimize build for cross-platform compatibility
        target: 'es2015',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['axios']
                }
            }
        }
    },
    // 确保public目录中的文件被复制到dist
    publicDir: 'public',
    optimizeDeps: {
        force: true,
        include: ['react', 'react-dom', 'axios']
    }
});
