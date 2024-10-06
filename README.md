```markdown
# Flux-API-Worker 📘🎨🤖

[English](./README.md) | [简体中文](./docs/README.zh-cn.md) | [繁體中文](./docs/README.zh-hant.md) | [日本語](./docs/README.ja.md) | [Español](./docs/README.es.md) | [Français](./docs/README.fr.md) | [Русский](./docs/README.ru.md) | [Deutsch](./docs/README.de.md)

## Introduction 🌟💡

Flux-API-Worker is an AI image generation service deployed on Cloudflare Workers. It leverages Cloudflare's Flux model to generate images and provides an efficient API interface to handle requests. This service can be easily integrated into various applications to provide users with powerful AI image generation capabilities. ✨🖼️🚀

## Features 🚀🌈

- 🎨 Customizable prompts for image generation
- 🌐 Optional prompt translation feature
- 📐 Supports multiple preset image sizes and aspect ratios
- 💾 Stores generated images using Cloudflare KV
- 🔄 Supports both streaming and non-streaming responses
- 🔒 Built-in system messages to ensure consistent output quality
- 🌍 Cross-Origin Resource Sharing (CORS) support

## Quick Start 🏃‍♂️💨

### Deploy on Cloudflare Dashboard 🖥️🛠️

1. Log in to your Cloudflare account and go to the Workers page. 👨‍💻👩‍💻
2. Click the "Create Service" button. 🆕
3. Name your Worker, for example, "flux-api". ✏️
4. Paste the provided Worker code in the editor. 📋
5. Click "Save and Deploy". 🚀

### Set Environment Variables ⚙️🔧

In the Worker settings, find the "Environment Variables" section and add the following variables:

## Environment Variables List 📋🔑

| Variable Name | Description | Type | Example | Default Value |
|---------------|-------------|------|---------|---------------|
| `API_KEY` | API authentication key 🔐 | String | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflare Account ID 🆔 | String | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare API token 🎟️ | String | `"your-cloudflare-api-token"` | - |
| `CF_IS_TRANSLATE` | Enable prompt translation 🌐 | String | `"true"` or `"false"` | - |
| `EXTERNAL_API_BASE` | External API base URL 🔗 | String | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | External translation model name 🤖 | String | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | External API access key 🗝️ | String | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Number of steps for the Flux model 🚶 | Integer | `"4"` | 4 |
| `IMAGE_EXPIRATION` | Image expiration time in KV (seconds) ⏳ | Integer | `"1800"` | 1800 |

Ensure these variables are correctly configured in the Cloudflare Worker environment settings. For variables with default values, you can leave them unchanged if no modifications are needed. 🔧✅

> Note: For security, set a complex string for the `API_KEY`. This will be used to authenticate API calls. 🔒🛡️

### Create KV Namespace 🗄️📦

1. In the Cloudflare Dashboard, go to the "Workers" page. 🖥️
2. Click on the "KV" tab. 📑
3. Create a new namespace and name it "FLUX_CF_KV". 🆕
4. In the Worker settings, bind this KV namespace to the `FLUX_CF_KV` variable. 🔗

## API Endpoints and Features 🌐🛠️

### 1. Welcome Page 👋

Access the root path of your Worker (`https://<your_worker_name>.<your_subdomain>.workers.dev/`) to display a welcome page confirming that the API service is running. ✅🏠

### 2. Chat Completions Endpoint 💬

Main image generation endpoint:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. Model Info Endpoint ℹ️

Retrieve information about available models:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
This endpoint returns information about the currently used Flux model. 🤖📊

### 4. Image Retrieval Endpoint 🖼️

Retrieve a generated image:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## User Guide 📖🧭

### Generate an Image 🖼️🎨

Send a POST request to the chat completions endpoint in the following format:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "A cute cat 3:2"
    }
  ],
  "stream": false
}
```

Headers must include:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> Important: Replace `YOUR_API_KEY` with the `API_KEY` you set in the environment variables. 🔑🔄

### Streaming Responses 🌊📡

If you want to receive a streaming response, set the `stream` parameter to `true`:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "A cute cat 3:2"
    }
  ],
  "stream": true
}
```

Streaming responses will be returned in Server-Sent Events (SSE) format, allowing real-time updates of the generation process. ⚡🔄

### Supported Image Sizes 📏🖼️

Flux-API-Worker supports the following preset image sizes and aspect ratios:

- 1:1 (1024x1024) - Default size 🟦
- 3:2 (768x512) 🖼️
- 2:3 (512x768) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

To specify a specific size, simply append the corresponding ratio to the prompt, for example:

```
"A cute cat 16:9"
```

If no size is specified, the system will default to generating a 1:1 (1024x1024) image. 🎛️🔧

### Cross-Origin Resource Sharing (CORS) Support 🌍🔓

Flux-API-Worker supports CORS, allowing API access from web applications hosted on different domains. This means you can directly call the API from frontend JavaScript applications without encountering cross-origin issues. 🔗🚫🚧

### Using in Third-Party Applications 🔗🔌

Flux-API-Worker can be easily integrated into various applications like NextWeb, ChatBox, etc. When configuring in these applications:

1. Set the API URL to your Worker URL (chat completions endpoint). 🔗
2. Enter the API KEY you set. 🔑
3. Ignore the system message configuration provided by the app, as Flux-API-Worker uses built-in system messages. 💬🚫

> Note: The context feature has been removed from Flux-API-Worker, and each call will generate a new, unique image. 🆕🖼️

### Response Format 📤📊

Example of a non-streaming response:

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
        "content": "🎨 Original prompt: A cute cat 3:2\n💬 Prompt model: Original Prompt\n🌐 Translated prompt: A cute cat\n📐 Image size: 768x512\n🌟 Image generated successfully!\nHere is the result:\n\n![Generated Image](https://your-worker-url.workers.dev/image/12345)"
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

## Notes ⚠️🚨

- Ensure that all necessary environment variables are correctly set. ✅🔧
- Keep the API key safe and avoid exposing it in client-side code. 🔒🙈
- Images stored in KV have an expiration time (default 30 minutes), so save important images promptly. ⏳💾
- If prompt translation is enabled, ensure the external API configuration is correct. 🌐🔧
- When using streaming responses, make sure your client can handle Server-Sent Events properly. 🌊📡

## Troubleshooting 🔧🚑

1. If you encounter an unauthorized error, check whether the API key is correctly set and used. 🔑❓
2. If image generation fails, verify that the Cloudflare

 Workers script and KV storage are configured properly. ⚠️🛠️
3. For prompt translation issues, confirm that the external translation API is reachable and correctly set up. 🌐🔄

For further assistance, refer to the Cloudflare Workers documentation or create an issue on our GitHub repository. 🚀💡

If you feel that this repo has helped you, please give me a star. ⭐⭐⭐ Thank you!
