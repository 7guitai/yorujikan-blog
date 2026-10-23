# よるじかん（SEOブログ）

「よるじかん｜電源オフの暮らしと快眠道具」の公式ブログ。Astro製の静的サイトです。
note（体験談寄りの連載）と役割を分け、こちらは検索から調べに来る方向けに、比較・選び方中心の記事を蓄積します。

- サイトの仮URL: https://yorujikan-blog.pages.dev （`astro.config.mjs` の `site` で管理）
- 記事は `src/content/blog/` の Markdown ファイル
- フッターと「このブログについて」に、Amazonアソシエイト参加の表記を入れています

## 運用手順（記事の公開まで）

1. `src/content/blog/` に Markdown ファイルを新規作成する（ファイル名がそのまま URL の slug になります。英小文字とハイフン推奨）
2. 下記の frontmatter を付ける
3. GitHub リポジトリへ push する
4. ホスティング側（Cloudflare Pages 等）が自動でビルド・デプロイする

公開前のローカル確認:

```bash
npm install   # 初回のみ
npm run dev   # 開発サーバー
npm run build # 本番ビルド（dist/ に出力）
```

## frontmatter の書き方

```markdown
---
title: "記事タイトル"
description: "検索結果に表示される要約。100〜120字程度"
pubDate: 2026-10-24
tags: ["セルフケア", "快眠グッズ"]
draft: false
---
```

| 項目 | 必須 | 説明 |
| --- | --- | --- |
| title | ○ | 記事タイトル |
| description | ○ | メタディスクリプション兼一覧ページの要約 |
| pubDate | ○ | 公開日（YYYY-MM-DD） |
| updatedDate | - | 更新日（任意） |
| tags | - | タグの配列。省略時は空 |
| draft | - | `true` にするとビルド対象から外れる（下書き）。省略時は `false` |

## 商品リンクのルール

- Amazonリンクは `https://www.amazon.co.jp/dp/<ASIN>?tag=kobebooka1-22` の形式で統一する
- 価格を書く場合は「執筆時点の目安」である旨と、変動する旨を記事内に注記する
- 医療効果の断定や誇大表現は書かない

## ディレクトリ構成

```
.
├── astro.config.mjs        # site URL 等の設定
├── public/                 # 静的ファイル（robots.txt, favicon 等）
├── src/
│   ├── content.config.ts   # コンテンツコレクション定義
│   ├── content/blog/       # 記事 Markdown
│   ├── layouts/Base.astro  # 共通レイアウト（SEOメタ・ヘッダー・フッター）
│   └── pages/
│       ├── index.astro         # 記事一覧
│       ├── about.astro         # このブログについて
│       └── blog/[slug].astro   # 記事ページ
└── package.json
```
