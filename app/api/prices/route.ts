import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword") || "ピカチュウ";

  const url = `https://www.cardrush-pokemon.jp/product-list?keyword=${encodeURIComponent(keyword)}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);

  const items: any[] = [];

  $("a").each((_, element) => {
    const text = $(element).text().replace(/\s+/g, " ").trim();
    const href = $(element).attr("href");

    if (
      text.includes(keyword) &&
      text.match(/[\d,]+円/) &&
      href
    ) {
      items.push({
        title: text,
        price: text.match(/[\d,]+円/)?.[0],
        url: href.startsWith("http")
          ? href
          : `https://www.cardrush-pokemon.jp${href}`,
      });
    }
  });

  return NextResponse.json({
    keyword,
    count: items.length,
    items: items.slice(0, 20),
  });
}