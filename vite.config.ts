import { defineConfig } from 'vite';

// Export Vite configuration
export default defineConfig({
  server: {
    host: true, // Bind the server to all network interfaces, allowing access from the local network
    port: 5173, // Specify the port the development server will run on
  },
});
