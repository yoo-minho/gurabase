export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  const { schema } = getQuery(event);

  const apiUrl = new URL(`http://localhost:3000/api/data`);
  apiUrl.search = new URLSearchParams({
    schema: String(schema),
  }).toString();

  try {
    const response = await fetch(apiUrl.toString());
    if (!response.ok) {
      throw new Error(
        `Error fetching from external API: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { statusCode: 500, message: "error 501" };
  }
});
