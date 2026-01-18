import { Elysia } from "elysia";
import { openapi } from '@elysiajs/openapi';

const app = new Elysia();

app.use(openapi()); 

app.listen(process.env["SERVER_PORT"] || 3000, () => {
  console.log(`Server is running on port ${process.env["SERVER_PORT"] || 3000}`);
});