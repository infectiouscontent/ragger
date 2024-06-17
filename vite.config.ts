import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Bind to all network interfaces
    port: 5173, // Specify the port
  },
});
