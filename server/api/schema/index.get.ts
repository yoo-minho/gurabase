import { FireStore } from "~/server/utils/firestore";

export default defineEventHandler(async (event) => {
  const fileStoreUtil = new FireStore("schemas");
  const schemas = await fileStoreUtil.find();

  const keys = [] as string[];
  const values = [] as any[];
  schemas.forEach((v) => {
    const { id, rest, createdAt } = v;
    if (keys.includes(rest)) {
      //skip
    } else {
      keys.push(rest);
      values.push({
        id,
        rest,
        createdAt: createdAt.toDate(),
      });
    }
  });

  return values;
});
