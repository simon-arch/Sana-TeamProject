import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-ignore
import fs from 'fs';
// @ts-ignore
import * as path from "node:path";

// https://vitejs.dev/config/
const ssl = {
  // @ts-ignore
  key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
  // @ts-ignore
  cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem')),
};

export default defineConfig({
  server: {
    https: ssl,
    port: 5173,
  },
  plugins: [react()]
});
