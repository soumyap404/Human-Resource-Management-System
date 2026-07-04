/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/apiRouter';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser middleware
  app.use(express.json());

  // Mount all API endpoints
  app.use('/api', apiRouter);

  // Serve static assets & index.html in production, or hook up Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite developer server attached as middleware');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets from:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Enterprise HRMS server is listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error during full-stack server boot:', err);
});
