import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get("url");

  return NextResponse.json({
    cardrush: "取得中",
    hareruya: "未実装",
    dragonstar: "未実装",
    targetUrl: url,
  });
}