import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import * as path from "node:path";

// https://vitejs.dev/config/
const ssl = {
  key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
};

export default defineConfig({
  server: {
    https: ssl,
    port: 5173,
  },
  plugins: [react()]
});
