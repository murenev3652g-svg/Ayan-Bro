import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json({ limit: '10mb' }));

  // Custom CORS middleware to allow Vercel or any other client domain to interact
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Proxy save endpoint to extendsclass bin
  app.post('/api/save-config', async (req, res) => {
    try {
      const config = req.body;
      const BIN_ID = 'eddeaef';
      const CLOUD_API_URL = `https://extendsclass.com/api/json-storage/bin/${BIN_ID}`;

      const response = await fetch(CLOUD_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const responseData = await response.json();
        return res.json({ success: true, data: responseData });
      } else {
        const errText = await response.text();
        console.error('Failed to update bin on extendsclass:', errText);
        return res.status(500).json({ success: false, error: 'ExtendsClass response failed' });
      }
    } catch (e: any) {
      console.error('Proxy save config failed:', e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  // Serve Vite / static files
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted in development mode');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
});
