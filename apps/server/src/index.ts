import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import logixlysia from "logixlysia";
import { env } from "@env";
import { userController } from "./app/user/user.controller.js";

const app = new Elysia();

app.use(openapi());

app.use(logixlysia());

// Controllers
app.use(userController);

app.listen(env.SERVER_PORT);