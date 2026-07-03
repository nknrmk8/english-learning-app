# 実務直結型 英語学習アプリ（仕様書 v1.0 準拠 MVP）

「教科書英語ではなく、明日の会議で使える英語」— 実会議データを活用した英語学習 PWA。

## ファイル構成

| ファイル | 役割 |
|---|---|
| `index.html` | アプリ本体（HTML/CSS/JS すべて込みの1ファイル） |
| `manifest.json` | PWA マニフェスト（ホーム画面追加用） |
| `sw.js` | Service Worker（オフライン対応） |
| `icon-192.png` / `icon-512.png` | アプリアイコン |

## スマホで使う方法

### 方法A：Webに公開して使う（推奨・PWAとしてフル機能）

マイク（音声認識）と「ホーム画面に追加」には **HTTPS** が必要です。無料で最も簡単なのは GitHub Pages / Netlify Drop / Cloudflare Pages。

例）Netlify Drop の場合：
1. https://app.netlify.com/drop を開く
2. `english-learning-app` フォルダをドラッグ＆ドロップ
3. 発行された URL をスマホで開く
4. **Android Chrome**：メニュー →「ホーム画面に追加」／ **iPhone Safari**：共有 →「ホーム画面に追加」

### 方法B：自宅Wi-Fiで PC からスマホに配信（お試し用）

```
cd C:\work\claude\english-learning-app
python -m http.server 8080
```

スマホで `http://<PCのIPアドレス>:8080` を開く（PCのIPは `ipconfig` で確認）。
※ HTTP のため、マイク採点（シャドーイング等）とホーム画面追加は動きません。閲覧・TTS再生は可能です。

### 方法C：PCでそのまま使う

`index.html` をダブルクリックするだけで動きます（Chrome / Edge 推奨）。

## 機能と仕様書の対応

| 仕様 | 実装状況 |
|---|---|
| F01 実例フレーズ集 | ✅ シーン別・話者/日付/背景/類似表現3件 |
| F02 重要単語ハイライト | ✅ Tier1赤/Tier2黄/Tier3青、タップで意味・発音・使用例 |
| F03 定型句データベース | ✅ お気に入り・シーン/難易度タグ・4択出題モード |
| F04 読み上げ（TTS） | ✅ Web Speech API（音声選択・速度0.7〜1.5x・ハイライト連動・連続再生） |
| F05 シャドーイング | ✅ 音声認識で採点・単語別チェック（Android Chrome / PC Chrome・Edge） |
| F06 瞬間英作文 | ✅ 制限時間・意味/文法/自然さの3軸簡易採点 |
| F07 AIロールプレイ | ✅ ホスト/交渉/見積説明の3モード（台本ベース）・会話ログ保存 |
| F08 進捗ダッシュボード | ✅ 学習時間・正答率・頻出間違い単語・シーン別到達度・弱点シーン優先出題 |
| F09 業務用語集 | ✅ 略語・正式名称・意味＋発音再生 |
| F10 会議録インポート | ✅ .vtt / .txt / .docx 対応。英語発言抽出・話者匿名化・端末内処理 |

## 仕様書との差分（Azure 未接続のため）

本 MVP はサーバー不要・端末内完結で動作します。以下は仕様書の指定サービスを代替しています：

- **TTS**：Azure Neural TTS → ブラウザ標準の Web Speech API（端末の音声エンジン依存。en-PH 等は端末設定で音声を追加すると選択可能）
- **音声認識**：Azure Speech to Text → Web Speech API（iOS Safari は非対応のため案内表示）
- **AI採点/ロールプレイ**：Azure OpenAI → 単語一致ベースの簡易採点＋シナリオ台本（自由会話は今後の拡張ポイント）
- **認証/DB**：Azure AD / Cosmos DB → 学習データは localStorage（端末内のみ、外部送信なし＝セキュリティ要件の「外部AIサービスへ送信しない」は満たす）

Azure 契約後は `speak()` / `makeRecognizer()` / ロールプレイ部分を API 呼び出しに差し替えることで、仕様書どおりの構成（Phase 2〜3）へ拡張できます。
