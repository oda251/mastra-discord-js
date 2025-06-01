// general
import "dotenv/config";

// Discord
import { Client, Events, GatewayIntentBits } from "discord.js";
import { message_handler } from "@/event_handler/message_handler";
import { reaction_handler } from "@/event_handler/reaction_handler";

// Mastra
import { Mastra } from "@mastra/core";
import ttsAgent from "@/agent/tts-agent";

// const mastra = new Mastra({
//   agents: { ttsAgent },
// });

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

client.login(process.env.DISCORD_BOT_TOKEN);
