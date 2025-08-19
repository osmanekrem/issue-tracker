import { handle } from 'hono/vercel';
import app from '../apps/server/src';

export default handle(app);