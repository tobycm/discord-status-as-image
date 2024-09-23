import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';
import { smallCard } from './controllers/smallCard';

const origin = import.meta.env.CORS_ORIGIN || '*';

const refinerEndpoint = import.meta.env.REFINER_API_URL || 'http://localhost:7000';

const app = new Elysia()
  .use(swagger({ autoDarkMode: true }))
  .use(
    cors({
      origin,
      methods: ['GET', 'POST'],
      allowedHeaders: ['content-type'],
    })
  )
  .onAfterHandle(({ set }) => {
    set.headers['cache-control'] = 'no-cache, no-store, must-revalidate, proxy-revalidate';
    set.headers.pragma = 'no-cache';
    set.headers.expires = 'Mon, 01 Jan 1990 00:00:00 GMT';
    set.headers['last-modified'] = 'Mon, 01 Jan 2999 00:00:00 GMT';
    set.headers['surrogate-control'] = 'no-store';
  })
  .get('/', () => ({ message: 'API of Discord Status as Image' }))
  .use(smallCard)

  .listen(3000);

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
