import { embedMany } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { PgVector } from "@mastra/pg";
import { MDocument } from "@mastra/rag";
import {gemini} from "@/llm_model/gemini";
import "dotenv/config";

import QA from "@assets/QA1.json";

async function initPgvector() {
  const connectionString = process.env.POSTGRES_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error(
      "POSTGRES_CONNECTION_STRING is not set in environment variables."
    );
  }
  const doc = MDocument.fromJSON(JSON.stringify(QA));
  const chunksWithMetadata = await doc.chunk({
    strategy: "json",
    maxSize: 256,
    convertLists: true,
    extract: {
      title: {
        llm: gemini,
        nodes: 1,
      },
      keywords: {
        llm: gemini,
        keywords: 8,
      },
    },
  });

  const { embeddings } = await embedMany({
    values: chunksWithMetadata.map((chunk) => chunk.text),
    model: cohere.embedding("embed-multilingual-light-v3.0", {}),
  });

  const pgVector = new PgVector({
    connectionString: connectionString,
  });
  await pgVector.createIndex({
    indexName: "tts_qa",
    dimension: 1024,
    indexConfig: {
      type: "hnsw",
    }
  });
  await pgVector.upsert({
    indexName: "tts_qa",
    vectors: embeddings,
    metadata: chunksWithMetadata.map((chunk) => chunk.metadata),
  });
  await pgVector.buildIndex({
    indexName: "tts_qa",
    metric: "cosine",
    indexConfig: { type: "hnsw" },
  });
}

initPgvector()