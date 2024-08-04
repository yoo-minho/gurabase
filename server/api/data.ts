import {
  FunctionDeclarationSchemaType,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { tryParseJSON } from "@/utils/comm-util";
import { FireStore } from "../utils/firestore";

const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  maxOutputTokens: 8192 * 10,
  responseMimeType: "application/json",
  responseSchema: {
    type: FunctionDeclarationSchemaType.ARRAY,
    items: {
      type: FunctionDeclarationSchemaType.STRING,
    },
  },
} as any;

export default defineEventHandler(async (event) => {
  const { schema } = getQuery(event);
  if (!schema) {
    return { error: true, message: "Schema empty!" };
  }

  let _schema = decodeURIComponent(String(schema));

  const fireStoreUtil = new FireStore("schemas");
  const fireStoreData = await fireStoreUtil.findOne(_schema);

  if (!fireStoreData) {
    return { error: true, message: "fireStoreData empty!" };
  }

  const input = [
    `"${fireStoreData.schema}" JsonSchema 가지고 4개 데이터를 랜덤으로 생성해줘!`,
  ].join("\n");

  const chatSession = model.startChat({
    generationConfig,
  });

  const { response } = await chatSession.sendMessage(input);

  let data = null;
  let responseText = response.text();
  if (data === null) data = tryParseJSON(responseText);
  if (data === null) data = tryParseJSON(`[${responseText}]`);

  if (data === null) {
    throw { error: true, message: "Data dont received" };
  }

  return data;
});
