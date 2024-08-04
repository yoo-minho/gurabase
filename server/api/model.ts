import {
  FunctionDeclarationSchemaType,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { prettyJsonStr } from "@/utils/comm-util";
import { MultiFormatResponseType } from "@/types/comm-type";

const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  maxOutputTokens: 8192 * 10,
  responseMimeType: "application/json",
  responseSchema: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      step1_rest_api: {
        type: FunctionDeclarationSchemaType.STRING,
      },
      step2_json_schema: {
        type: FunctionDeclarationSchemaType.STRING,
      },
      step3_type_of_typescript: {
        type: FunctionDeclarationSchemaType.STRING,
      },
      step4_dto_of_java: {
        type: FunctionDeclarationSchemaType.STRING,
      },
    },
  },
} as any;

export default defineEventHandler(async (event) => {
  const { prompt } = getQuery(event);
  if (!prompt) {
    return { error: true, message: "Prompt empty!" };
  }

  let _prompt = decodeURIComponent(String(prompt));

  const input = [
    // `"${_prompt}" 관련한 간단한 서비스를 만들려고해. 그 때 스텝에 맞춰 포맷을 생성해줘!`,
    `I'm trying to create a simple service related to "${_prompt}". Then create a format according to the steps!`,
    `step 1. create REST API Name plural! (max 2 keyword, ex. "posts", "users", "todos", "order-items")`,
    `step 2. create json schema By https://json-schema.org/draft/2020-12/schema!`,
    `step 3. create "Type" of typescript! (No Interface, Write “JSDoc” above the declared Code)`,
    `step 4. create Dto of java! (Omit Getter/Setter, Write “JavaDoc” in detail above the declared Code)`,
  ].join("\n");

  const chatSession = model.startChat({
    generationConfig,
  });

  const { response } = await chatSession.sendMessage(input);

  const formatJson = JSON.parse(response.text());
  const {
    step1_rest_api,
    step2_json_schema,
    step3_type_of_typescript,
    step4_dto_of_java,
  } = formatJson;

  try {
    return {
      error: false,
      rest: step1_rest_api,
      formats: [
        {
          language: "json",
          content: prettyJsonStr(step2_json_schema || ""),
        },
        {
          language: "typescript",
          content: step3_type_of_typescript || "",
        },
        {
          language: "java",
          content: step4_dto_of_java || "",
        },
      ],
    } as MultiFormatResponseType;
  } catch (e) {
    console.error(e);
    return { error: true, message: "Try Again!" };
  }
});
