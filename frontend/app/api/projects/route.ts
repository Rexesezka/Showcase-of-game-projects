import { NextRequest, NextResponse } from "next/server";

const backendBaseUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const url = query
    ? `${backendBaseUrl}/api/projects/?${query}`
    : `${backendBaseUrl}/api/projects/`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить проекты" }, { status: 502 });
  }
}
