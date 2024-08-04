export const prettyJsonStr = (json: string | Object) => {
  if (!json) return json;

  const _json = typeof json === "string" ? tryParseJSON(json) : json;
  return JSON.stringify(_json, null, 2);
};

export function tryParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}
