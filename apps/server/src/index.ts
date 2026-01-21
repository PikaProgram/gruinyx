import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import logixlysia from "logixlysia";
import { env } from "@env";
import { authController } from "./app/auth/auth.controller.js";
import { errorHandler } from "./plugin/handler/error.handler.js";

const app = new Elysia();

app.use(openapi());

app.use(logixlysia());

app.use(errorHandler());

// Controllers
app.use(authController);

app.listen(env.SERVER_PORT);