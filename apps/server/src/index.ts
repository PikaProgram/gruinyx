import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';
import logixlysia from "logixlysia";

const app = new Elysia();

app.use(openapi());

app.use(logixlysia());

app.listen(process.env["SERVER_PORT"] || 3000, () => {
  console.log(`Server is running on port ${process.env["SERVER_PORT"] || 3000}`);
});