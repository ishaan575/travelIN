import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'travelin-api', timestamp: new Date().toISOString() });
  });

  // Schema endpoint for Supabase migration inspection
  app.get('/api/schema', (req, res) => {
    try {
      const schemaPath = path.resolve(__dirname, 'supabase_schema.sql');
      if (fs.existsSync(schemaPath)) {
        const content = fs.readFileSync(schemaPath, 'utf8');
        return res.json({ schema: content });
      }
      return res.status(404).json({ error: 'Schema file not found' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Download project ZIP archive
  app.get('/api/download-zip', (req, res) => {
    const zipPath = path.resolve(__dirname, 'travelIN-project.zip');
    if (fs.existsSync(zipPath)) {
      return res.download(zipPath, 'travelIN-project.zip');
    }
    return res.status(404).json({ error: 'Project zip archive not found' });
  });

  // In production, serve dist assets; in dev, mount Vite middlewares
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[travelIN] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[travelIN] Server startup error:', err);
});
