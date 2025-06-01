import { Agent } from "@mastra/core/agent";
import { gemini } from "@/llm_model/gemini";

const model = gemini;
const ttsAgent = new Agent({
  name: "tts-agent",
  instructions: "TikTokShopに関する質問に答えるエージェントです。",
  model: model,
});

export default ttsAgent;
