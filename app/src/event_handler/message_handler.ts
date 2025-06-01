import { type OmitPartialGroupDMChannel, Message } from "discord.js";
import ttsAgent from "@/agent/tts-agent.js";
import qa from "@assets/QA1.json";

export async function message_handler(
  msg: OmitPartialGroupDMChannel<Message<boolean>>
) {
  if (msg.content.trim() === "" || msg.author.bot) {
    return;
  }
  msg.channel.sendTyping();
  const reply = await ttsAgent.generate(
    [
      {
        role: "user",
        content: msg.content,
      },
    ],
    {
      context: [
        {
          role: "system",
          content:
            "質問には、次のJSONを参照して答えてください。\n" +
            JSON.stringify(qa, null, 0),
        },
      ],
    }
  );
  const message = reply.text;
  console.log(`Received message from ${msg.author.tag}: ${msg.content}`);
  console.log(`Replying with: ${message}`);
  msg.channel.sendTyping();
  if (message.length === 0) {
    msg.reply("申し訳ありませんが、応答を生成できませんでした。");
    return;
  } else if (message.length > 2000) {
    const chunks = message.match(/[\s\S]{1,2000}/g) || [];
    for (const chunk of chunks) {
      msg.reply(chunk);
    }
    return;
  }
  msg.reply(message);
}
