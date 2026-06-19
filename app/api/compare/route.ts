import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

async function getCardRushPrice(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      cache: "no-store",
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    const text = $("body").text();

    const price =
      text.match(/[\d,]+円/)?.[0] || "取得失敗";

    return price;
  } catch {
    return "取得失敗";
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({
      cardrush: "URLなし",
      hareruya: "未実装",
      dragonstar: "未実装",
      targetUrl: null,
    });
  }

  const cardrush = await getCardRushPrice(url);

  return NextResponse.json({
    cardrush,
    hareruya: "未実装",
    dragonstar: "未実装",
    targetUrl: url,
  });
}