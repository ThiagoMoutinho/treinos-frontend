export async function POST(request: Request) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      cookie: request.headers.get("cookie") ?? "",
    },
    body: await request.text(),
  });

  const headers = new Headers(response.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
