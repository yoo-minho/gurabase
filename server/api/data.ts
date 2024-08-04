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
  const query = getQuery(event);
  const { schema, per_page = 4, lang = "ko" } = query;
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
    `"${fireStoreData.schema}" JsonSchema 가지고 아래의 조건에 맞춰 ${per_page}개 데이터를 랜덤으로 생성해줘!`,
    `-조건1. id는 10,000번 이내로 설정해줘!`,
    `-조건2. 최대한 실제로 있을법한 데이터를 만들어줘!`,
    `-조건3. 값은 "${lang}" ISO 639-1 표준 언어코드에 맞게 만들어줘!`,
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
