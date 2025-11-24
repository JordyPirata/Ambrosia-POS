import { NextResponse } from "next/server";

const upstream =
  process.env.NEXT_PUBLIC_API_URL ||
  `http://${process.env.HOST || "127.0.0.1"}:${process.env.NEXT_PUBLIC_PORT_API || "9154"}`;

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const upstreamUrl = `${upstream}/uploads/${resolvedParams.path.join("/")}`;

  try {
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: request.headers,
    });

    const headers = new Headers();
    response.headers.forEach((value, key) => headers.set(key, value));
    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("Proxy uploads error:", error);
    return NextResponse.json({ error: "Failed to fetch upload" }, { status: 500 });
  }
}
