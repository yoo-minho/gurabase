export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");

  const query = getQuery(event);

  const { req } = event.node;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  const apiUrl = new URL(`${baseUrl}/api/data`);
  apiUrl.search = new URLSearchParams({
    schema: String(query.schema),
    ...query,
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
