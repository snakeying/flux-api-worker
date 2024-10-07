# Flux-API-Worker - README 📘🎨🤖

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

## 簡介 🌟💡

Flux-API-Worker 是一個部署在 Cloudflare Worker 上的 AI 圖像生成服務。它利用 Cloudflare 提供的 Flux 模型來生成圖像，並提供了一個高效的 API 介面來處理請求。這個服務可以輕鬆整合到各種應用中，為用戶提供強大的 AI 圖像生成能力。✨🖼️🚀

## 功能特點 🚀🌈

- 🎨 支援自定義提示詞生成圖像
- 🌐 可選的提示詞翻譯功能
- 📐 支援多種預設圖像尺寸和寬高比
- 💾 使用 Cloudflare KV 儲存生成的圖像
- 🔄 支援串流和非串流回應
- 🔒 內置系統訊息，確保一致的輸出品質
- 🌍 跨源資源共享（CORS）支援

## 快速開始 🏃‍♂️💨

### 在 Cloudflare Dashboard 中部署 🖥️🛠️

1. 登入到您的 Cloudflare 帳戶，進入 Workers 頁面。👨‍💻👩‍💻
2. 點擊 "創建服務" 按鈕。🆕
3. 為您的 Worker 命名，例如 "flux-api"。✏️
4. 在編輯器中，貼上提供的 Worker 代碼。📋
5. 點擊 "保存並部署" 按鈕。🚀

### 設置環境變數 ⚙️🔧

在 Worker 的設置頁面中，找到 "環境變數" 部分，添加以下變數：

## 環境變數列表 📋🔑

| 變數名 | 描述 | 類型 | 示例 | 預設值 |
|--------|------|------|------|--------|
| `API_KEY` | API 身份驗證密鑰 🔐 | 字串 | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflare 帳戶 ID 🆔 | 字串 | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare API 令牌 🎟️ | 字串 | `"your-cloudflare-api-token"` | - |
| `CF_IS_TRANSLATE` | 是否啟用提示詞翻譯 🌐 | 字串 | `"true"` 或 `"false"` | - |
| `EXTERNAL_API_BASE` | 外部 API 的基礎 URL 🔗 | 字串 | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | 外部翻譯模型名稱 🤖 | 字串 | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | 外部 API 的存取密鑰 🗝️ | 字串 | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Flux 模型的步數 🚶 | 整數 | `"4"` | 4 |
| `IMAGE_EXPIRATION` | 圖像在 KV 中的過期時間（秒）⏳ | 整數 | `"1800"` | 1800 |

請確保在 Cloudflare Worker 的環境變數設置中正確配置這些變數。對於有預設值的變數，如不需更改，可保持預設設置。🔧✅

> 注意：為了保證安全，請為 `API_KEY` 設置一個複雜的字串。這將用於驗證 API 呼叫的合法性。🔒🛡️

### 創建 KV 命名空間 🗄️📦

1. 在 Cloudflare Dashboard 中，轉到 "Workers" 頁面。🖥️
2. 點擊 "KV" 選項卡。📑
3. 創建一個新的命名空間，命名為 "FLUX_CF_KV"。🆕
4. 在 Worker 的設置中，將這個 KV 命名空間綁定到 `FLUX_CF_KV` 變數。🔗

## API 端點和功能 🌐🛠️

### 1. 歡迎頁面 👋

訪問 Worker 的根路徑 (`https://<your_worker_name>.<your_subdomain>.workers.dev/`) 將顯示一個歡迎頁面，確認 API 服務正在運行。✅🏠

### 2. 聊天完成端點 💬

主要的圖像生成端點：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. 模型資訊端點 ℹ️

獲取可用模型資訊：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
這個端點返回當前使用的 Flux 模型資訊。🤖📊

### 4. 圖像獲取端點 🖼️

獲取生成的圖像：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## 使用指南 📖🧭

### 生成圖像 🖼️🎨

發送 POST 請求到聊天完成端點，格式如下：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "一隻可愛的貓咪 3:2"
    }
  ],
  "stream": false
}
```

請求頭必須包含：

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> 重要：請將 `YOUR_API_KEY` 替換為您在環境變數中設置的 `API_KEY` 值。🔑🔄

### 串流回應 🌊📡

如果您希望接收串流回應，將 `stream` 參數設置為 `true`：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "一隻可愛的貓咪 3:2"
    }
  ],
  "stream": true
}
```

串流回應將以 Server-Sent Events (SSE) 格式返回，允許即時獲取生成進度。⚡🔄

### 支援的圖像尺寸 📏🖼️

Flux-API-Worker 支援以下預設的圖像尺寸和寬高比：

- 1:1 (1024x1024) - 默认尺寸 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

要指定特定的尺寸，只需在提示詞後面添加相應的比例，例如：

```
"一隻可愛的貓咪 16:9"
```

如果沒有指定尺寸，系統將預設生成 1:1 (1024x1024) 的圖片。🎛️🔧

### 跨源資源共享（CORS）支援 🌍🔓

Flux-API-Worker 支援 CORS，允許從不同域名的網頁應用程式訪問 API。這意味著您可以在前端 JavaScript 應用中直接呼叫 API，而不會遇到跨域問題。🔗🚫🚧

### 在第三方應用中使用 🔗🔌

Flux-API-Worker 可以輕鬆整合到各種應用中，如 NextWeb、ChatBox 等。在這些應用中配置時：

1. 將 API 地址設置為您的 Worker URL（聊天完成端點）。🔗
2. 輸入您設置的 API KEY。🔑
3. 忽略應用提供的 System Message 設置，因為 Flux-API-Worker 使用內置的 System Message。💬🚫

> 注意：Flux-API-Worker 已經移除了上下文功能，每次呼叫都會生成新的獨特圖像。🆕🖼️

### 回應格式 📤📊

非串流回應示例：

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
        "content": "🎨 原始提示詞：一隻可愛的貓咪 3:2\n💬 提示詞生成模型：Original Prompt\n🌐 翻譯後的提示詞：一隻可愛的貓咪\n📐 圖像規格：768x512\n🌟 圖像生成成功！\n以下是結果：\n\n![生成的圖像](https://your-worker-url.workers.dev/image/12345)"
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

- 確保所有必要的環境變數都已正確設置。✅🔧
- API 密鑰應當妥善保管，避免在客戶端代碼中暴露。🔒🙈
- 圖像在 KV 儲存中有過期時間（預設 30 分鐘），請及時保存重要的圖像。⏳💾
- 如啟用提示詞翻譯功能，請確保外部 API 配置正確。🌐🔧
- 使用串流回應時，確保您的客戶端能夠正確處理 Server-Sent Events。🌊📡

## 故障排除 🔧🚑

1. 遇到未授權錯誤時，請檢查 API 密鑰是否正確設置和使用。🔑❓
2. 圖像生成失敗時，請驗證 Cloudflare API Token 是否具有正確的權限。🎟️🔍
3. 提示詞翻譯不工作時，請確認 `CF_IS_TRANSLATE` 設置為 'true' 且外部 API 配置無誤。🌐🔧
4. 如果收到 404 錯誤，確保您訪問的是正確的端點路徑。🔍🚷
5. 對於其他錯誤，檢查 Worker 的日誌以獲取更詳細的錯誤資訊。📋🔬

## 進一步定製 🛠️🎨

您可以通過修改 Worker 代碼來進一步優化 API 的功能，例如：

- 調整支援的圖像尺寸和寬高比 📏✂️
- 修改內置的系統訊息以改變提示詞生成的行為 💬🔄
- 添加額外的錯誤處理和日誌記錄機制 🚨📊
- 實現自定義的速率限制或其他安全措施 🛡️⏱️

我希望這個 README 能協助您快速部署和使用 Flux-API-Worker。如果您有任何疑問或需要進一步的幫助，請隨時與我聯繫。💌👨‍💻👩‍💻

如果你覺得這個 repo 幫到了您，請給我一個 star 吧。⭐⭐⭐ 謝謝
