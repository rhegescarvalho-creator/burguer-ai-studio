import fastify from 'fastify';
import cors from '@fastify/cors';
import * as dotenv from 'dotenv';
import { registerRoutes } from './routes';

// Load environment variables
dotenv.config();

const server = fastify({ 
  logger: true,
  bodyLimit: 104857600 // 100MB limit for rich media, playlists, and base64 assets
});

// Setup function to register plugins and routes
let initialized = false;
const init = async () => {
  if (initialized) return;
  await server.register(cors, {
    origin: true,
  });
  await server.register(registerRoutes);
  initialized = true;
};

// For Vercel Serverless environment
export default async (req: any, res: any) => {
  await init();
  await server.ready();
  server.server.emit('request', req, res);
};

// For local running
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      await init();
      const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
      await server.listen({ port, host: '0.0.0.0' });
      server.log.info(`Server is running at http://localhost:${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };
  start();
}
