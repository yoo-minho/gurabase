import { FireStore } from "~/server/utils/firestore";

export default defineEventHandler(async (event) => {
  const { rest, schema } = await readBody(event);

  const fileStoreUtil = new FireStore("schemas");
  const id = await fileStoreUtil.save({
    rest,
    schema,
  });

  return {
    message: "Document added",
    id,
  };
});
