このフォルダには自作曲の音声ファイル（mp3 など）を置きます。

## 使い方

1. 音声ファイル（例: `my-song.mp3`）をこのフォルダに置く
2. `data/tracks.json` に以下のようなエントリーを追加する

```json
{
  "title": "曲のタイトル",
  "date": "2026-01-01",
  "description": "曲の説明",
  "type": "local",
  "src": "assets/audio/my-song.mp3"
}
```

詳しくはリポジトリ直下の README.md を参照してください。
