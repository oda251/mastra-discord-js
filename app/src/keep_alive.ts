import { Hono } from "hono";

const server = new Hono();

server.get("/keep-alive", (c) => {
  return c.text("I'm alive!");
});

export default server;
