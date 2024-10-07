# Flux-API-Worker - README 📘🎨🤖

[English](./README.md) | [简体中文](./docs/README.zh-cn.md) | [繁體中文](./docs/README.zh-hant.md) | [日本語](./docs/README.ja.md) | [Español](./docs/README.es.md) | [Français](./docs/README.fr.md) | [Русский](./docs/README.ru.md) | [Deutsch](./docs/README.de.md)

## Introduction 🌟💡

Flux-API-Worker is an AI image generation service deployed on Cloudflare Workers. It utilizes Cloudflare's Flux model to generate images and provides an efficient API interface for handling requests. This service can be easily integrated into various applications, offering users powerful AI image generation capabilities. ✨🖼️🚀

## Features 🚀🌈

- 🎨 Support for custom prompts to generate images
- 🌐 Optional prompt optimization feature
- 📐 Support for multiple preset image sizes and aspect ratios
- 💾 Use of Cloudflare KV to store generated images
- 🔄 Support for streaming and non-streaming responses
- 🔒 Built-in system messages to ensure consistent output quality
- 🌍 Cross-Origin Resource Sharing (CORS) support

## Quick Start 🏃‍♂️💨

### Deploy in Cloudflare Dashboard 🖥️🛠️

1. Log in to your Cloudflare account and navigate to the Workers page. 👨‍💻👩‍💻
2. Click the "Create a Service" button. 🆕
3. Name your Worker, e.g., "flux-api". ✏️
4. Paste the provided Worker code into the editor. 📋
5. Click the "Save and Deploy" button. 🚀

### Set Up Environment Variables ⚙️🔧

In the Worker's settings page, find the "Environment Variables" section and add the following variables:

## Environment Variables List 📋🔑

| Variable Name | Description | Type | Example | Default |
|---------------|-------------|------|---------|---------|
| `API_KEY` | API authentication key 🔐 | String | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflare Account ID 🆔 | String | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare API Token 🎟️ | String | `"your-cloudflare-api-token"` | - |
| `PROMPT_OPTIMIZATION` | Enable Prompt Optimization 🌐 | String | `"true"` or `"false"` | - |
| `EXTERNAL_API_BASE` | External API base URL 🔗 | String | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | External translation model name 🤖 | String | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | External API access key 🗝️ | String | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Number of steps for Flux model 🚶 | Integer | `"4"` | 4 |
| `IMAGE_EXPIRATION` | Image expiration time in KV (seconds) ⏳ | Integer | `"1800"` | 1800 |

Ensure these variables are correctly configured in your Cloudflare Worker's environment variables settings. For variables with default values, you can keep the default if no change is needed. 🔧✅

> Note: For security, set a complex string for `API_KEY`. This will be used to validate the legitimacy of API calls. 🔒🛡️

### Create KV Namespace 🗄️📦

1. In the Cloudflare Dashboard, go to the "Workers" page. 🖥️
2. Click on the "KV" tab. 📑
3. Create a new namespace named "FLUX_CF_KV". 🆕
4. In the Worker's settings, bind this KV namespace to the `FLUX_CF_KV` variable. 🔗

## API Endpoints and Functionality 🌐🛠️

### 1. Welcome Page 👋

Accessing the Worker's root path (`https://<your_worker_name>.<your_subdomain>.workers.dev/`) will display a welcome page confirming the API service is running. ✅🏠

### 2. Chat Completions Endpoint 💬

Main image generation endpoint:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. Model Information Endpoint ℹ️

Get available model information:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
This endpoint returns information about the currently used Flux model. 🤖📊

### 4. Image Retrieval Endpoint 🖼️

Retrieve generated images:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## Usage Guide 📖🧭

### Generate Images 🖼️🎨

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

The request headers must include:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> Important: Replace `YOUR_API_KEY` with the `API_KEY` value you set in the environment variables. 🔑🔄

### Streaming Response 🌊📡

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

Streaming responses will be returned in Server-Sent Events (SSE) format, allowing real-time generation progress updates. ⚡🔄

### Supported Image Sizes 📏🖼️

Flux-API-Worker supports the following preset image sizes and aspect ratios:

- 1:1 (1024x1024) - Default size 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

To specify a particular size, simply add the corresponding ratio after the prompt, for example:

```
"A cute cat 16:9"
```

If no size is specified, the system will default to generating a 1:1 (1024x1024) image. 🎛️🔧

### Cross-Origin Resource Sharing (CORS) Support 🌍🔓

Flux-API-Worker supports CORS, allowing access to the API from web applications on different domains. This means you can call the API directly from frontend JavaScript applications without encountering cross-origin issues. 🔗🚫🚧

### Using in Third-Party Applications 🔗🔌

Flux-API-Worker can be easily integrated into various applications such as NextWeb, ChatBox, etc. When configuring in these applications:

1. Set the API address to your Worker URL (chat completions endpoint). 🔗
2. Enter the API KEY you set. 🔑
3. No need to consider the System Message settings provided by the application, as the Flux-API-Worker uses a built-in System Message. 💬🚫

> Note: Flux-API-Worker has removed the context functionality, generating a new unique image with each call. 🆕🖼️

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
        "content": "🎨 Original prompt: A cute cat 3:2\n💬 Prompt generation model: Original Prompt\n🌐 Translated prompt: A cute cat\n📐 Image specifications: 768x512\n🌟 Image generation successful!\nHere's the result:\n\n![Generated Image](https://your-worker-url.workers.dev/image/12345)"
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

## Considerations ⚠️🚨

- Ensure all necessary environment variables are correctly set. ✅🔧
- API keys should be kept secure and not exposed in client-side code. 🔒🙈
- Images in KV storage have an expiration time (default 30 minutes), so save important images promptly. ⏳💾
- If enabling prompt translation, ensure the external API is configured correctly. 🌐🔧
- When using streaming responses, make sure your client can properly handle Server-Sent Events. 🌊📡

## Troubleshooting 🔧🚑

1. For unauthorized errors, check if the API key is correctly set and used. 🔑❓
2. If image generation fails, verify that the Cloudflare API Token has the correct permissions. 🎟️🔍
3. If prompt translation isn't working, confirm that `CF_IS_TRANSLATE` is set to 'true' and the external API configuration is correct. 🌐🔧
4. For 404 errors, ensure you're accessing the correct endpoint path. 🔍🚷
5. For other errors, check the Worker's logs for more detailed error information. 📋🔬

## Further Customization 🛠️🎨

You can further optimize the API's functionality by modifying the Worker code, for example:

- Adjust supported image sizes and aspect ratios 📏✂️
- Modify built-in system messages to change prompt generation behavior 💬🔄
- Add additional error handling and logging mechanisms 🚨📊
- Implement custom rate limiting or other security measures 🛡️⏱️

I hope this README helps you quickly deploy and use Flux-API-Worker. If you have any questions or need further assistance, please feel free to contact me. 💌👨‍💻👩‍💻

If you find this repo helpful, please give it a star. ⭐⭐⭐ Thank you!
