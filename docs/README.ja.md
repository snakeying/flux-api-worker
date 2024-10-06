# Flux-API-Worker - README 📘🎨🤖

[English](./README.md) | [简体中文](./docs/README.zh-cn.md) | [繁體中文](./docs/README.zh-hant.md) | [日本語](./docs/README.ja.md) | [Español](./docs/README.es.md) | [Français](./docs/README.fr.md) | [Русский](./docs/README.ru.md) | [Deutsch](./docs/README.de.md)

## はじめに 🌟💡

Flux-API-WorkerはCloudflare Worker上にデプロイされたAI画像生成サービスです。CloudflareのFluxモデルを利用して画像を生成し、効率的なAPIインターフェイスを提供します。このサービスは様々なアプリケーションに簡単に統合でき、ユーザーに強力なAI画像生成機能を提供します。✨🖼️🚀

## 主な機能 🚀🌈

- 🎨 カスタムプロンプトによる画像生成
- 🌐 オプションのプロンプト翻訳機能
- 📐 複数のプリセット画像サイズとアスペクト比
- 💾 Cloudflare KVを使用した生成画像の保存
- 🔄 ストリーミングおよび非ストリーミングレスポンスのサポート
- 🔒 一貫した出力品質を確保する内蔵システムメッセージ
- 🌍 クロスオリジンリソース共有（CORS）サポート

## クイックスタート 🏃‍♂️💨

### Cloudflare Dashboardでのデプロイ 🖥️🛠️

1. Cloudflareアカウントにログインし、Workersページに移動します。👨‍💻👩‍💻
2. 「サービスを作成」ボタンをクリックします。🆕
3. Workerに名前を付けます（例：「flux-api」）。✏️
4. エディタに提供されたWorkerコードを貼り付けます。📋
5. 「保存してデプロイ」ボタンをクリックします。🚀

### 環境変数の設定 ⚙️🔧

Workerの設定ページで、「環境変数」セクションを見つけ、以下の変数を追加します：

## 環境変数リスト 📋🔑

| 変数名 | 説明 | 型 | 例 | デフォルト値 |
|--------|------|------|------|--------|
| `API_KEY` | API認証キー 🔐 | 文字列 | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflareアカウント ID 🆔 | 文字列 | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare APIトークン 🎟️ | 文字列 | `"your-cloudflare-api-token"` | - |
| `CF_IS_TRANSLATE` | プロンプト翻訳を有効にするかどうか 🌐 | 文字列 | `"true"` または `"false"` | - |
| `EXTERNAL_API_BASE` | 外部APIのベースURL 🔗 | 文字列 | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | 外部翻訳モデル名 🤖 | 文字列 | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | 外部APIのアクセスキー 🗝️ | 文字列 | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Fluxモデルのステップ数 🚶 | 整数 | `"4"` | 4 |
| `IMAGE_EXPIRATION` | KVでの画像の有効期限（秒）⏳ | 整数 | `"1800"` | 1800 |

Cloudflare Workerの環境変数設定でこれらの変数を正しく設定してください。デフォルト値がある変数は、変更が必要ない場合はそのままにしておいてもかまいません。🔧✅

> 注意：セキュリティを確保するため、`API_KEY`には複雑な文字列を設定してください。これはAPI呼び出しの正当性を検証するために使用されます。🔒🛡️

### KV名前空間の作成 🗄️📦

1. Cloudflare Dashboardで、「Workers」ページに移動します。🖥️
2. 「KV」タブをクリックします。📑
3. "FLUX_CF_KV"という名前で新しい名前空間を作成します。🆕
4. Workerの設定で、このKV名前空間を`FLUX_CF_KV`変数にバインドします。🔗

## APIエンドポイントと機能 🌐🛠️

### 1. ウェルカムページ 👋

Workerのルートパス（`https://<your_worker_name>.<your_subdomain>.workers.dev/`）にアクセスすると、APIサービスが稼働していることを確認するウェルカムページが表示されます。✅🏠

### 2. チャット完了エンドポイント 💬

主要な画像生成エンドポイント：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. モデル情報エンドポイント ℹ️

利用可能なモデル情報の取得：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
このエンドポイントは現在使用中のFluxモデルの情報を返します。🤖📊

### 4. 画像取得エンドポイント 🖼️

生成された画像の取得：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## 使用ガイド 📖🧭

### 画像の生成 🖼️🎨

チャット完了エンドポイントにPOSTリクエストを送信します。フォーマットは以下の通りです：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "かわいい猫 3:2"
    }
  ],
  "stream": false
}
```

リクエストヘッダーには以下を含める必要があります：

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> 重要：`YOUR_API_KEY`を環境変数で設定した`API_KEY`の値に置き換えてください。🔑🔄

### ストリーミングレスポンス 🌊📡

ストリーミングレスポンスを受信したい場合は、`stream`パラメータを`true`に設定します：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "かわいい猫 3:2"
    }
  ],
  "stream": true
}
```

ストリーミングレスポンスはServer-Sent Events（SSE）形式で返され、生成の進捗をリアルタイムで取得できます。⚡🔄

### サポートされる画像サイズ 📏🖼️

Flux-API-Workerは以下のプリセット画像サイズとアスペクト比をサポートしています：

- 1:1（1024x1024）- デフォルトサイズ 🟦
- 3:2（768x512）🖼️
- 2:3（512x768）📱
- 16:9（1024x576）🖥️
- 9:16（576x1024）📱

特定のサイズを指定するには、プロンプトの後に対応する比率を追加するだけです。例えば：

```
"かわいい猫 16:9"
```

サイズが指定されていない場合、システムはデフォルトで1:1（1024x1024）の画像を生成します。🎛️🔧

### クロスオリジンリソース共有（CORS）サポート 🌍🔓

Flux-API-WorkerはCORSをサポートしており、異なるドメインのウェブアプリケーションからAPIにアクセスすることができます。これにより、フロントエンドのJavaScriptアプリケーションで直接APIを呼び出すことができ、クロスドメインの問題に遭遇することはありません。🔗🚫🚧

### サードパーティアプリケーションでの使用 🔗🔌

Flux-API-WorkerはNextWeb、ChatBoxなど、さまざまなアプリケーションに簡単に統合できます。これらのアプリケーションで設定する際：

1. APIアドレスをあなたのWorker URL（チャット完了エンドポイント）に設定します。🔗
2. 設定したAPI KEYを入力します。🔑
3. アプリケーションが提供するSystem Message設定は無視してください。Flux-API-Workerは内蔵のSystem Messageを使用します。💬🚫

> 注意：Flux-API-Workerはコンテキスト機能を削除しました。毎回の呼び出しで新しいユニークな画像が生成されます。🆕🖼️

### レスポンス形式 📤📊

非ストリーミングレスポンスの例：

```json
{
  "id": "chatcmpl-1234567890",
  "created": 1677649420,
  "model": "@cf/black-forest-labs/flux-1-schnell",
  "object": "chat.completion",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "🎨 元のプロンプト：かわいい猫 3:2\n💬 プロンプト生成モデル：オリジナルプロンプト\n🌐 翻訳後のプロンプト：かわいい猫\n📐 画像仕様：768x512\n🌟 画像生成成功！\n結果は以下の通りです：\n\n![生成された画像](https://your-worker-url.workers.dev/image/12345)"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 100,
    "total_tokens": 120
  }
}
```

## 注意事項 ⚠️🚨

- 必要なすべての環境変数が正しく設定されていることを確認してください。✅🔧
- APIキーは適切に管理し、クライアント側のコードで露出しないようにしてください。🔒🙈
- 画像はKVストレージで有効期限があります（デフォルトは30分）。重要な画像はタイムリーに保存してください。⏳💾
- プロンプト翻訳機能を有効にする場合は、外部APIの設定が正しいことを確認してください。🌐🔧
- ストリーミングレスポンスを使用する場合は、クライアントがServer-Sent Eventsを正しく処理できることを確認してください。🌊📡

## トラブルシューティング 🔧🚑

1. 認証エラーが発生した場合は、APIキーが正しく設定され使用されているか確認してください。🔑❓
2. 画像生成が失敗した場合は、Cloudflare API Tokenが正しい権限を持っているか確認してください。🎟️🔍
3. プロンプト翻訳が機能しない場合は、`CF_IS_TRANSLATE`が'true'に設定されており、外部APIの設定が正しいことを確認してください。🌐🔧
4. 404エラーを受け取った場合は、正しいエンドポイントパスにアクセスしていることを確認してください。🔍🚷
5. その他のエラーについては、Workerのログでより詳細なエラー情報を確認してください。📋🔬

## さらなるカスタマイズ 🛠️🎨

Workerコードを修正することで、APIの機能をさらに最適化することができます。例えば：

- サポートする画像サイズとアスペクト比の調整 📏✂️
- プロンプト生成の動作を変更するための内蔵システムメッセージの修正 💬🔄
- 追加のエラー処理とログ記録メカニズムの実装 🚨📊
- カスタムのレート制限やその他のセキュリティ対策の実装 🛡️⏱️

このREADMEがFlux-API-Workerの迅速な展開と使用に役立つことを願っています。質問や更なる支援が必要な場合は、お気軽にお問い合わせください。💌👨‍💻👩‍💻

このリポジトリがお役に立てた場合は、スターをつけていただけると幸いです。⭐⭐⭐ ありがとうございます！
