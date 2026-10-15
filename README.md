# enotaka1024.github.io

個人の日記と自作音楽を公開するシンプルな静的ブログです。ビルドツールは使わず、素の HTML / CSS / JS のみで構成されており、GitHub Pages でそのまま公開できます。

## サイト構成

```
/
├── index.html          # トップページ（プロフィール、Instagramリンク、最新プレビュー）
├── diary.html          # 日記一覧ページ
├── music.html          # 音楽一覧ページ
├── style.css           # 共通スタイルシート
├── js/
│   ├── home.js         # トップページの最新プレビュー描画
│   ├── diary.js        # 日記一覧の描画
│   └── music.js        # 音楽一覧の描画
├── data/
│   ├── posts.json      # 日記データ
│   └── tracks.json     # 音楽トラックデータ
└── assets/
    └── audio/          # ローカル音声ファイルの置き場所
```

## 日記を追加する方法

`data/posts.json` に配列の要素として追記します。新しい記事を追加するだけで、ページ側のコードを変更する必要はありません（日付の新しい順に自動でソートされます）。

```json
{
  "title": "記事のタイトル",
  "date": "2026-10-20",
  "body": "本文です。\n改行は \\n で表現できます。\n<strong>簡単なHTMLタグ</strong>も使えます。"
}
```

- `date` は `YYYY-MM-DD` 形式で指定してください。
- `body` 内の改行 (`\n`) は自動的に `<br>` に変換されて表示されます。
- `<strong>` や `<em>` などの簡単な HTML タグをそのまま埋め込むことも可能です。

## 音楽を追加する方法

`data/tracks.json` に配列の要素として追記します。`type` フィールドで「ローカル音声ファイル」と「外部サービスの埋め込みプレイヤー」のどちらかを選べます。

### ローカル音声ファイルを追加する場合 (`type: "local"`)

1. 音声ファイル（mp3 など）を `assets/audio/` に配置する
2. `data/tracks.json` に以下のように追記する

```json
{
  "title": "曲のタイトル",
  "date": "2026-10-20",
  "description": "曲の説明（任意）",
  "type": "local",
  "src": "assets/audio/your-song.mp3"
}
```

### SoundCloud / YouTube など外部埋め込みプレイヤーを使う場合 (`type: "embed"`)

各サービスが提供する iframe 埋め込み用 URL を `embedUrl` に指定します。

```json
{
  "title": "曲のタイトル",
  "date": "2026-10-20",
  "description": "曲の説明（任意）",
  "type": "embed",
  "embedUrl": "https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/your-account/your-track"
}
```

YouTube の場合は埋め込み用 URL（例: `https://www.youtube.com/embed/VIDEO_ID`）を指定してください。

## GitHub Pages での公開方法

1. このリポジトリの **Settings > Pages** を開く
2. **Source** を `main` ブランチ、フォルダを `/ (root)` に設定する
3. 保存すると数分以内に `https://<ユーザー名>.github.io/` で公開されます

直下に `index.html` があるため、追加のビルド設定は不要です。

## プロフィール文章のカスタマイズ

`index.html` 内のプロフィール文章（`<section class="hero">` 内）はプレースホルダーです。自由に書き換えてください。
