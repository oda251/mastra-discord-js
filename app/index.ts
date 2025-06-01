// Discord
import { Client, Events, GatewayIntentBits } from "discord.js";
import { message_handler } from "@/event_handler/message_handler";
import { reaction_handler } from "@/event_handler/reaction_handler";

// Mastra
import ttsAgent from "@/agent/tts-agent";

// Hono
import keepAlive from "@/keep_alive";
import { serve } from "@hono/node-server";

const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b),
});

client.once(Events.ClientReady, () => {
  if (!client.user) {
    console.error("ログインに失敗しました。");
    return;
  }
  console.log(`${client.user.tag} でログインしています。`);
});

client.on(Events.MessageReactionAdd, reaction_handler);

client.on(Events.MessageCreate, message_handler);

console.log("Bot is starting...");
client.login(process.env.DISCORD_TOKEN);

serve({
  fetch: keepAlive.fetch,
  port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
});
