"use client";

import { useState } from "react";

type Item = {
  title: string;
  price: string;
  url: string;
};

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState<{
    keyword: string;
    count: number;
    items: Item[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const searchCard = async () => {
    if (!keyword) return;

    setLoading(true);
    setData(null);

    const res = await fetch(
      `/api/prices?keyword=${encodeURIComponent(keyword)}`
    );

    const json = await res.json();
    setData(json);
    setLoading(false);
  };
const compareCard = async () => {
  if (!selectedItem) return;

  const res = await fetch(
  `/api/compare?url=${encodeURIComponent(selectedItem.url)}`
);

const json = await res.json();

console.log(json);

alert(
  `カードラッシュ: ${json.cardrush}\n` +
  `晴れる屋: ${json.hareruya}\n` +
  `ドラゴンスター: ${json.dragonstar}\n\n` +
  `最安値: ${json.cheapest ? json.cheapest.shop + " " + json.cheapest.price : "判定できません"}\n\n` +
  `URL: ${json.targetUrl}`
);
};
  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-5xl font-bold mb-8">
        ポケカ価格比較サイト
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="カード名を入力"
          className="text-black p-2 rounded w-80"
        />

        <button
          onClick={searchCard}
          className="bg-blue-500 px-4 py-2 rounded"
        >
          検索
        </button>
      </div>

      {loading && <p>取得中...</p>}
{selectedItem && (
  <div className="mb-6 p-4 border rounded-xl bg-green-900">
    <h2 className="text-2xl font-bold">
      選択中のカード
    </h2>

    <p className="mt-2">
      {selectedItem.title}
    </p>
<button
  onClick={compareCard}
  className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded font-bold"
>
  最安値を比較
</button>
    <p className="text-green-300">
      {selectedItem.price}
    </p>
  </div>
)}
      {data && (
        <>
          <p className="mb-4">
            {data.keyword} の候補：{data.count}件
          </p>

          <div className="grid gap-4">
            {data.items.map((item, index) => (
              <div
  key={index}
  onClick={() => setSelectedItem(item)}
  className="border p-4 rounded-xl bg-slate-800 cursor-pointer hover:border-blue-400"
>
                <h2 className="text-xl font-bold mb-2">
                  {item.title}
                </h2>

                <p className="text-green-400 font-bold">
                  {item.price}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  className="text-blue-400 underline"
                >
                  商品ページを見る
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
  }