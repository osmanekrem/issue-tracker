import "dotenv/config";
import {trpcServer} from "@hono/trpc-server";
import {createContext} from "./lib/context";
import {appRouter} from "./routers/index";
import {auth} from "./lib/auth";
import {Hono} from "hono";
import {cors} from "hono/cors";
import {logger} from "hono/logger";
import {serveStatic} from "@hono/node-server/serve-static";
import { serve } from '@hono/node-server';

const app = new Hono();

app.use(logger());
app.use("/*", cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));


app.use("/trpc/*", trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
        return createContext({context});
    },
}));

app.use(
    '*',
    serveStatic({
        root: './apps/web/dist',
    })
);

app.get(
    '*',
    serveStatic({
        path: './apps/web/dist/index.html',
    })
);

const port =  3000;
console.log('Sunucu başlatılıyor: http://localhost:' + port);

serve({
    fetch: app.fetch,
    port,
});

