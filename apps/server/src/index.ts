import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import logixlysia from "logixlysia";
import { env } from "./utils/env.js";

const app = new Elysia();

app.use(openapi());

app.use(logixlysia());

app.listen(env.SERVER_PORT);