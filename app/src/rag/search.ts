import { embed } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { PgVector } from "@mastra/pg";
import type { QueryResult } from "@mastra/core";

/**
 * 入力された文字列に基づいて、類似した文書を検索する関数
 * @param query 検索するテキスト
 * @param limit 返す結果の最大数
 * @returns 類似度が高い文書の配列
 */
export async function searchSimilarDocuments(query: string, limit = 5) {
  try {
    // 1. クエリ文字列をベクトル化
    const { embedding } = await embed({
      value: query,
      model: cohere.embedding("embed-multilingual-light-v3.0", {
      }),
    });

    // 2. PgVectorクライアントを初期化
    if (!process.env.POSTGRES_CONNECTION_STRING) {
      throw new Error("POSTGRES_CONNECTION_STRING is not set in environment variables.");
    }
    const pgVector = new PgVector({
      connectionString: process.env.POSTGRES_CONNECTION_STRING,
    });

    // 3. 類似度検索を実行
    const results = await pgVector.query({
      indexName: "tts_qa",
      queryVector: embedding,
    });

    // 4. 結果を整形して返す
    return results;
  } catch (error) {
    console.error("検索中にエラーが発生しました:", error);
    throw error;
  }
}
