import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-forms': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'vendor-router': ['react-router-dom'],
          'vendor-icons': ['react-icons'],
          'vendor-ui': ['zustand'],
          
          // Feature chunks
          'auth-pages': [
            './src/App/LoginPage.tsx',
            './src/App/RegisterPage.tsx',
            './src/App/ForgotPassword.tsx',
          ],
          'product-pages': [
            './src/App/Product.tsx',
            './src/App/SearchPage.tsx',
          ],
          'cart-checkout': [
            './src/App/Cart.tsx',
            './src/App/Checkout.tsx',
          ],
          'order-pages': [
            './src/App/Orders.tsx',
            './src/App/OrderTracking.tsx',
            './src/App/OrderSuccess.tsx',
          ],
          'admin-pages': [
            './src/App/Admindashboard.tsx',
            './src/App/AdminPage.tsx',
            './src/App/Edit.tsx',
          ],
        },
      },
    },
    // Optimize chunks
    chunkSizeWarningLimit: 500, // 500kb
    cssCodeSplit: true, // Split CSS into separate files
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'react-router-dom',
      'zustand',
    ],
  },
})
