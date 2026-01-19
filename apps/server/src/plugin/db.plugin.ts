import Elysia from "elysia";
import { dbClient } from "../database/client";

export const drizzlePlugin = () => new Elysia({name: "drizzle-plugin"}).decorate("db", dbClient);