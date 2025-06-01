import {
  Message,
  type PartialMessageReaction,
  MessageReaction,
  User,
  type PartialUser,
} from "discord.js";

export async function reaction_handler(
  reaction: PartialMessageReaction | MessageReaction,
  user: User | PartialUser
): Promise<void> {
  if (reaction.partial) {
    reaction.fetch().catch(console.error);
  }
  if (user.bot) return; // ボットのリアクションは無視
  console.log(`${user.tag} が ${reaction.emoji.name} をリアクションしました。`);
}
