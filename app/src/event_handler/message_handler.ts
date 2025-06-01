import { type OmitPartialGroupDMChannel, Message } from "discord.js";
import ttsAgent from "@/agent/tts-agent.js";

export async function message_handler(
  msg: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (msg.content.trim() === "" || msg.author.bot) {
    return;
  }
  console.log(`メッセージを受信: ${msg.content}`);
  const reply = await ttsAgent.generate([
    {
      role: "user",
      content: msg.content,
    },
  ]);
  const message = reply.text;
  msg.reply(message);
}
