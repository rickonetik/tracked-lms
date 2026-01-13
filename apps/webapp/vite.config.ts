import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '/../..', '');
  const ngrokUrl = env.WEBAPP_NGROK_URL || process.env.WEBAPP_NGROK_URL;
  const allowedHosts = ['localhost', '127.0.0.1'];

  if (ngrokUrl) {
    try {
      const url = new URL(ngrokUrl);
      allowedHosts.push(url.hostname);
    } catch (e) {}
  }

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.WEBAPP_PORT || process.env.WEBAPP_PORT || '5173', 10),
      host: env.WEBAPP_HOST || process.env.WEBAPP_HOST || true,
      allowedHosts: allowedHosts,
    },
  };
});
