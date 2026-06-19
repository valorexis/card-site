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
async function getHareruyaPrice(url: string) {
  try {
    return "取得準備中";
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
const hareruya = await getHareruyaPrice(url);
const dragonstar = "未実装";


const prices = [
  { shop: "カードラッシュ", price: cardrush },
  { shop: "晴れる屋", price: hareruya },
  { shop: "ドラゴンスター", price: dragonstar },
];

const validPrices = prices
  .map((item) => ({
    ...item,
   number: Number(String(item.price).replace(/[^0-9]/g, "")),
  }))
  .filter((item) => item.number > 0);

const cheapest =
  validPrices.length > 0
    ? validPrices.sort((a, b) => a.number - b.number)[0]
    : null;

return NextResponse.json({
  cardrush,
  hareruya,
  dragonstar,

  cheapest,

  targetUrl: url,
});
}