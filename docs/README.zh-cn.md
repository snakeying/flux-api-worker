# Flux-API-Worker 📘🎨🤖

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

## 简介 🌟💡

Flux-API-Worker 是一个部署在 Cloudflare Worker 上的 AI 图像生成服务。它利用 Cloudflare 提供的 Flux 模型来生成图像，并提供了一个高效的 API 接口来处理请求。这个服务可以轻松集成到各种应用中，为用户提供强大的 AI 图像生成能力。✨🖼️🚀

## 功能特点 🚀🌈

- 🎨 支持自定义提示词生成图像
- 🌐 可选的提示词翻译功能
- 📐 支持多种预设图像尺寸和宽高比
- 💾 使用 Cloudflare KV 存储生成的图像
- 🔄 支持流式和非流式响应
- 🔒 内置系统消息，确保一致的输出质量
- 🌍 跨源资源共享（CORS）支持

## 快速开始 🏃‍♂️💨

### 在 Cloudflare Dashboard 中部署 🖥️🛠️

1. 登录到您的 Cloudflare 账户，进入 Workers 页面。👨‍💻👩‍💻
2. 点击 "创建服务" 按钮。🆕
3. 为您的 Worker 命名，例如 "flux-api"。✏️
4. 在编辑器中，粘贴提供的 Worker 代码。📋
5. 点击 "保存并部署" 按钮。🚀

### 设置环境变量 ⚙️🔧

在 Worker 的设置页面中，找到 "环境变量" 部分，添加以下变量：

## 环境变量列表 📋🔑

| 变量名 | 描述 | 类型 | 示例 | 默认值 |
|--------|------|------|------|--------|
| `API_KEY` | API 身份验证密钥 🔐 | 字符串 | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflare 账户 ID 🆔 | 字符串 | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare API 令牌 🎟️ | 字符串 | `"your-cloudflare-api-token"` | - |
| `CF_IS_TRANSLATE` | 是否启用提示词翻译 🌐 | 字符串 | `"true"` 或 `"false"` | - |
| `EXTERNAL_API_BASE` | 外部 API 的基础 URL 🔗 | 字符串 | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | 外部翻译模型名称 🤖 | 字符串 | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | 外部 API 的访问密钥 🗝️ | 字符串 | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Flux 模型的步数 🚶 | 整数 | `"4"` | 4 |
| `IMAGE_EXPIRATION` | 图像在 KV 中的过期时间（秒）⏳ | 整数 | `"1800"` | 1800 |

请确保在 Cloudflare Worker 的环境变量设置中正确配置这些变量。对于有默认值的变量，如不需更改，可保持默认设置。🔧✅

> 注意：为了保证安全，请为 `API_KEY` 设置一个复杂的字符串。这将用于验证 API 调用的合法性。🔒🛡️

### 创建 KV 命名空间 🗄️📦

1. 在 Cloudflare Dashboard 中，转到 "Workers" 页面。🖥️
2. 点击 "KV" 选项卡。📑
3. 创建一个新的命名空间，命名为 "FLUX_CF_KV"。🆕
4. 在 Worker 的设置中，将这个 KV 命名空间绑定到 `FLUX_CF_KV` 变量。🔗

## API 端点和功能 🌐🛠️

### 1. 欢迎页面 👋

访问 Worker 的根路径 (`https://<your_worker_name>.<your_subdomain>.workers.dev/`) 将显示一个欢迎页面，确认 API 服务正在运行。✅🏠

### 2. 聊天完成端点 💬

主要的图像生成端点：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. 模型信息端点 ℹ️

获取可用模型信息：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
这个端点返回当前使用的 Flux 模型信息。🤖📊

### 4. 图像获取端点 🖼️

获取生成的图像：
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## 使用指南 📖🧭

### 生成图像 🖼️🎨

发送 POST 请求到聊天完成端点，格式如下：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "一只可爱的猫咪 3:2"
    }
  ],
  "stream": false
}
```

请求头必须包含：

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> 重要：请将 `YOUR_API_KEY` 替换为您在环境变量中设置的 `API_KEY` 值。🔑🔄

### 流式响应 🌊📡

如果您希望接收流式响应，将 `stream` 参数设置为 `true`：

```json
{
  "messages": [
    {
      "role": "user",
      "content": "一只可爱的猫咪 3:2"
    }
  ],
  "stream": true
}
```

流式响应将以 Server-Sent Events (SSE) 格式返回，允许实时获取生成进度。⚡🔄

### 支持的图像尺寸 📏🖼️

Flux-API-Worker 支持以下预设的图像尺寸和宽高比：

- 1:1 (1024x1024) - 默认尺寸 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

要指定特定的尺寸，只需在提示词后面添加相应的比例，例如：

```
"一只可爱的猫咪 16:9"
```

如果没有指定尺寸，系统将默认生成 1:1 (1024x1024) 的图片。🎛️🔧

### 跨源资源共享（CORS）支持 🌍🔓

Flux-API-Worker 支持 CORS，允许从不同域名的网页应用程序访问 API。这意味着您可以在前端 JavaScript 应用中直接调用 API，而不会遇到跨域问题。🔗🚫🚧

### 在第三方应用中使用 🔗🔌

Flux-API-Worker 可以轻松集成到各种应用中，如 NextWeb、ChatBox 等。在这些应用中配置时：

1. 将 API 地址设置为您的 Worker URL（聊天完成端点）。🔗
2. 输入您设置的 API KEY。🔑
3. 忽略应用提供的 System Message 设置，因为 Flux-API-Worker 使用内置的 System Message。💬🚫

> 注意：Flux-API-Worker 已经移除了上下文功能，每次调用都会生成新的独特图像。🆕🖼️

### 响应格式 📤📊

非流式响应示例：

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
        "content": "🎨 原始提示词：一只可爱的猫咪 3:2\n💬 提示词生成模型：Original Prompt\n🌐 翻译后的提示词：一只可爱的猫咪\n📐 图像规格：768x512\n🌟 图像生成成功！\n以下是结果：\n\n![生成的图像](https://your-worker-url.workers.dev/image/12345)"
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

## 注意事项 ⚠️🚨

- 确保所有必要的环境变量都已正确设置。✅🔧
- API 密钥应当妥善保管，避免在客户端代码中暴露。🔒🙈
- 图像在 KV 存储中有过期时间（默认 30 分钟），请及时保存重要的图像。⏳💾
- 如启用提示词翻译功能，请确保外部 API 配置正确。🌐🔧
- 使用流式响应时，确保您的客户端能够正确处理 Server-Sent Events。🌊📡

## 故障排除 🔧🚑

1. 遇到未授权错误时，请检查 API 密钥是否正确设置和使用。🔑❓
2. 图像生成失败时，请验证 Cloudflare API Token 是否具有正确的权限。🎟️🔍
3. 提示词翻译不工作时，请确认 `CF_IS_TRANSLATE` 设置为 'true' 且外部 API 配置无误。🌐🔧
4. 如果收到 404 错误，确保您访问的是正确的端点路径。🔍🚷
5. 对于其他错误，检查 Worker 的日志以获取更详细的错误信息。📋🔬

## 进一步定制 🛠️🎨

您可以通过修改 Worker 代码来进一步优化 API 的功能，例如：

- 调整支持的图像尺寸和宽高比 📏✂️
- 修改内置的系统消息以改变提示词生成的行为 💬🔄
- 添加额外的错误处理和日志记录机制 🚨📊
- 实现自定义的速率限制或其他安全措施 🛡️⏱️

我希望这个 README 能协助您快速部署和使用 Flux-API-Worker。如果您有任何疑问或需要进一步的帮助，请随时与我联系。💌👨‍💻👩‍💻

如果你觉得这个repo帮到了您，请给我一个start吧。⭐⭐⭐ 谢谢
