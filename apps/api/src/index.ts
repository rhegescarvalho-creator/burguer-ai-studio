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

const start = async () => {
  try {
    // Register CORS
    await server.register(cors, {
      origin: true, // Allow all origins for dev simplicity; specify in production
    });

    // Register routes
    await server.register(registerRoutes);

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await server.listen({ port, host: '0.0.0.0' });
    
    server.log.info(`Server is running at http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
