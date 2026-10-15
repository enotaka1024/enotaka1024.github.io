# enotaka1024.github.io

個人の日記と自作音楽を公開するシンプルな静的ブログです。ビルドツールは使わず、素の HTML / CSS / JS のみで構成されており、GitHub Pages でそのまま公開できます。日本語/英語の切り替えにも対応しています。

## サイト構成

```
/
├── index.html          # トップページ（プロフィール、Instagramリンク、最新プレビュー）
├── diary.html          # 日記一覧ページ
├── music.html          # 音楽一覧ページ
├── style.css           # 共通スタイルシート
├── js/
│   ├── i18n.js         # 日英(ja/en)切り替え用の共通モジュール
│   ├── home.js         # トップページの最新プレビュー描画
│   ├── diary.js        # 日記一覧の描画
│   └── music.js        # 音楽一覧の描画
├── data/
│   ├── posts.json      # 日記データ(ja/en両方のテキストを持つ)
│   └── tracks.json     # 音楽トラックデータ(ja/en両方のテキストを持つ)
└── assets/
    └── audio/          # ローカル音声ファイルの置き場所
```

## 日本語/英語の切り替えについて

このサイトはビルドツールを使わず、クライアントサイドJSのみで日英2言語に対応しています。

- 各ページのヘッダーにある言語切り替えボタン(「English」/「日本語」)をクリックすると、ページ全体(ナビ・本文・日記・音楽一覧)がリロードなしで即座に切り替わります。
- 選択した言語は `localStorage` に保存され、次回訪問時も維持されます。
- 初回訪問時(保存された言語設定がない場合)は `navigator.language` を見て、日本語環境なら日本語、それ以外は英語をデフォルトとして表示します。
- 仕組みの実体は `js/i18n.js` です。固定のUI文言(ナビゲーション、見出し、ボタン、フッターなど)はこのファイル内の辞書 `{ja: {...}, en: {...}}` にまとめられており、HTML側で `data-i18n="キー名"` 属性を付けた要素のテキストを、このJSが現在の言語に応じて差し替えます。
- `js/home.js` / `js/diary.js` / `js/music.js` は、`data/posts.json` や `data/tracks.json` から取得したデータを `window.I18N.pick(field, lang)` を使って現在の言語で表示し、言語切り替え時には再フェッチせずにキャッシュ済みデータで再描画します。

**日記・音楽を追加するときの注意:** 下記の各データ追加方法にある通り、`title` / `body` / `description` は文字列ではなく `{ "ja": "...", "en": "..." }` の形で**日本語と英語の両方**を必ず記述してください。片方しか書かなかった場合、もう一方の言語で表示するときにフォールバック(`ja` → `en` の順)されますが、できるだけ両方書くようにしてください。

## 日記を追加する方法

`data/posts.json` に配列の要素として追記します。新しい記事を追加するだけで、ページ側のコードを変更する必要はありません(日付の新しい順に自動でソートされます)。`title` と `body` は `{ "ja": "...", "en": "..." }` の形式で、日本語版・英語版の両方を記述してください。

```json
{
  "title": {
    "ja": "記事のタイトル",
    "en": "Post title"
  },
  "date": "2026-10-20",
  "body": {
    "ja": "本文です。\n改行は \\n で表現できます。\n<strong>簡単なHTMLタグ</strong>も使えます。",
    "en": "This is the body text.\nUse \\n for line breaks.\nSimple <strong>HTML tags</strong> also work."
  }
}
```

- `date` は `YYYY-MM-DD` 形式で指定してください。
- `body.ja` / `body.en` 内の改行 (`\n`) は自動的に `<br>` に変換されて表示されます。
- `<strong>` や `<em>` などの簡単な HTML タグをそのまま埋め込むことも可能です。

## 音楽を追加する方法

`data/tracks.json` に配列の要素として追記します。`type` フィールドで「ローカル音声ファイル」と「外部サービスの埋め込みプレイヤー」のどちらかを選べます。`title` と `description` は `{ "ja": "...", "en": "..." }` の形式で、日本語版・英語版の両方を記述してください。

### ローカル音声ファイルを追加する場合 (`type: "local"`)

1. 音声ファイル（mp3 など）を `assets/audio/` に配置する
2. `data/tracks.json` に以下のように追記する

```json
{
  "title": {
    "ja": "曲のタイトル",
    "en": "Track title"
  },
  "date": "2026-10-20",
  "description": {
    "ja": "曲の説明(任意)",
    "en": "Track description (optional)"
  },
  "type": "local",
  "src": "assets/audio/your-song.mp3"
}
```

### SoundCloud / YouTube など外部埋め込みプレイヤーを使う場合 (`type: "embed"`)

各サービスが提供する iframe 埋め込み用 URL を `embedUrl` に指定します。

```json
{
  "title": {
    "ja": "曲のタイトル",
    "en": "Track title"
  },
  "date": "2026-10-20",
  "description": {
    "ja": "曲の説明(任意)",
    "en": "Track description (optional)"
  },
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

プロフィール文章は `index.html` の `<section class="hero">` 内にプレースホルダーとして表示されていますが、実際の表示テキストは `js/i18n.js` の辞書内の `hero.title` / `hero.body` (ja/en両方)で管理されています。書き換える際は `js/i18n.js` 側のテキストを編集してください。
