import { handle } from 'hono/vercel';
import app from '../apps/server/src';
export const config = {
    runtime: 'edge',
};

export default handle(app);