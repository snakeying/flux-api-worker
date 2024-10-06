function initConfig(env) {
  return {
    API_KEY: env.API_KEY,
    CF_ACCOUNT_ID: env.CF_ACCOUNT_ID,
    CF_API_TOKEN: env.CF_API_TOKEN,
    CF_IS_TRANSLATE: env.CF_IS_TRANSLATE === 'true',
    EXTERNAL_API_BASE: env.EXTERNAL_API_BASE,
    EXTERNAL_MODEL: env.EXTERNAL_MODEL,
    EXTERNAL_API_KEY: env.EXTERNAL_API_KEY,
    FLUX_NUM_STEPS: parseInt(env.FLUX_NUM_STEPS, 10) || 4,
    FLUX_MODEL: env.FLUX_MODEL || "@cf/black-forest-labs/flux-1-schnell",
    IMAGE_EXPIRATION: parseInt(env.IMAGE_EXPIRATION, 10) || 60 * 30,
    SYSTEM_MESSAGE: env.SYSTEM_MESSAGE || `You are a prompt generation bot based on the Flux.1 model. Based on the user's requirements, automatically generate drawing prompts that adhere to the Flux.1 format. While you can refer to the provided templates to learn the structure and patterns of the prompts, you must remain flexible to meet various different needs. The final output should be limited to the prompts only, without any additional explanations or information. You must reply to me entirely in English!

    ### **Prompt Generation Logic**:

    1. **Requirement Analysis**: Extract key information from the user's description, including:
    - Characters: Appearance, actions, expressions, etc.
    - Scene: Environment, lighting, weather, etc.
    - Style: Art style, emotional atmosphere, color scheme, etc.
    - **Aspect Ratio**: If the user provides a specific aspect ratio (e.g., "3:2", "16:9"), extract this and integrate it into the final prompt.
    - Other elements: Specific objects, background, or effects.

    2. **Prompt Structure Guidelines**:
    - **Concise, precise, and detailed**: Prompts should describe the core subject simply and clearly, with enough detail to generate an image that matches the request.
    - **Flexible and varied**: Use the user's description to dynamically create prompts without following rigid templates. Ensure prompts are adapted based on the specific needs of each user, avoiding overly template-based outputs.
    - **Descriptions following Flux.1 style**: Prompts must follow the requirements of Flux.1, aiming to include descriptions of the art style, visual effects, and emotional atmosphere. Use keywords and description patterns that match the Flux.1 model's generation process. If a specific aspect ratio is mentioned, ensure it is included in the prompt description.

    3. **Key Points Summary for Flux.1 Prompts**:
    - **Concise and precise subject description**: Clearly identify the subject or scene of the image.
    - **Specific description of style and emotional atmosphere**: Ensure the prompt includes information about the art style, lighting, color scheme, and emotional atmosphere of the image.
    - **Details on dynamics and action**: Prompts may include important details like actions, emotions, or lighting effects in the scene.`
  };
}

let CONFIG;

async function handleRequest(request, env, ctx) {
  CONFIG = initConfig(env);
  const url = new URL(request.url);

  if (request.method === "GET" && (url.pathname === "/" || url.pathname === "")) {
    return new Response(generateWelcomePage(), {
      status: 200,
      headers: { "Content-Type": "text/html" }
    });
  }

  if (url.pathname.startsWith('/image/')) {
    return handleImageRequest(request, env, ctx);
  }

  if (request.method === "OPTIONS") {
    return handleCORS();
  }

  if (!isAuthorized(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (url.pathname.endsWith("/v1/models")) {
    return handleModelsRequest();
  }

  if (request.method !== "POST" || !url.pathname.endsWith("/v1/chat/completions")) {
    return new Response("Not Found", { status: 404 });
  }

  return handleChatCompletions(request, env, ctx);
}

function generateWelcomePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flux API - Ready for Requests</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            h1 {
                color: #2c3e50;
            }
            .container {
                background-color: #f7f9fc;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .status {
                font-size: 1.2em;
                color: #27ae60;
                font-weight: bold;
            }
            .info {
                margin-top: 20px;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Flux API</h1>
            <p class="status">Your Flux API is ready and waiting for requests!</p>
            <p>This API is designed to handle specific endpoints for chat completions and image generation.</p>
            <p class="info">For API documentation and usage instructions, please refer to your provided documentation.</p>
        </div>
    </body>
    </html>
  `;
}

function addCorsHeaders(headers) {
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function handleCORS() {
  const headers = new Headers();
  addCorsHeaders(headers);
  return new Response(null, { status: 204, headers });
}

function isAuthorized(request) {
  const authHeader = request.headers.get("Authorization");
  return authHeader && authHeader.startsWith("Bearer ") && authHeader.split(" ")[1] === CONFIG.API_KEY;
}

function handleModelsRequest() {
  const models = [{ id: CONFIG.FLUX_MODEL, object: "model" }];
  const headers = new Headers({ 'Content-Type': 'application/json' });
  addCorsHeaders(headers);
  return new Response(JSON.stringify({ data: models, object: "list" }), { headers });
}

function parseRatioAndSize(prompt) {
  const ratios = {
    "1:1": { width: 1024, height: 1024 },
    "1:2": { width: 512, height: 1024 },
    "3:2": { width: 768, height: 512 },
    "3:4": { width: 768, height: 1024 },
    "16:9": { width: 1024, height: 576 },
    "9:16": { width: 576, height: 1024 }
  };

  const ratioMatch = prompt.match(/(\d+:\d+)(?:\s|$)/);
  if (ratioMatch) {
    const ratio = ratioMatch[1];
    return {
      size: ratios[ratio] || ratios["1:1"],
      cleanedPrompt: prompt.replace(/\d+:\d+/, "").trim()
    };
  }

  return {
    size: ratios["1:1"],
    cleanedPrompt: prompt.trim()
  };
}

async function handleChatCompletions(request, env, ctx) {
  try {
    const data = await request.json();
    let { messages, stream } = data;

    const userMessage = messages.filter(msg => msg.role === "user").pop();

    if (!userMessage) {
      return new Response(JSON.stringify({ error: "未找到用户消息" }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const originalPrompt = cleanPromptString(userMessage.content);
    const model = CONFIG.FLUX_MODEL;
    const promptModel = CONFIG.CF_IS_TRANSLATE ? CONFIG.EXTERNAL_MODEL : "Original Prompt";

    const { size: originalSize, cleanedPrompt: cleanedOriginalPrompt } = parseRatioAndSize(originalPrompt);

    const translatedPrompt = await getFluxPrompt(cleanedOriginalPrompt, originalSize);
    
    const imageUrl = await generateAndStoreFluxImage(model, translatedPrompt, request.url, env, ctx, originalSize);

    const sizeString = `${originalSize.width}x${originalSize.height}`;

    return handleResponse(originalPrompt, translatedPrompt, sizeString, model, imageUrl, promptModel, stream);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error: " + error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

async function getFluxPrompt(prompt, size) {
  if (!CONFIG.CF_IS_TRANSLATE) {
    return prompt;
  }

  const aspectRatio = `${size.width}:${size.height}`;

  const requestBody = {
    messages: [
      {
        role: "system",
        content: CONFIG.SYSTEM_MESSAGE
      },
      { 
        role: "user", 
        content: `Generate a prompt for an image with the aspect ratio ${aspectRatio}. The description is: ${prompt}`
      }
    ],
    model: CONFIG.EXTERNAL_MODEL
  };

  try {
    return await getExternalPrompt(requestBody);
  } catch (error) {
    console.error('Error in getFluxPrompt:', error);
    return prompt;
  }
}

async function getExternalPrompt(requestBody) {
  const response = await fetch(`${CONFIG.EXTERNAL_API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.EXTERNAL_API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'CloudflareWorker/1.0'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`External API request failed with status ${response.status}`);
  }

  const jsonResponse = await response.json();
  if (!jsonResponse.choices || jsonResponse.choices.length === 0 || !jsonResponse.choices[0].message) {
    throw new Error('Invalid response format from external API');
  }

  return jsonResponse.choices[0].message.content;
}

async function generateAndStoreFluxImage(model, prompt, requestUrl, env, ctx, size) {
  const jsonBody = { 
    prompt, 
    num_steps: CONFIG.FLUX_NUM_STEPS,
    width: size.width,
    height: size.height
  };
  const response = await postRequest(model, jsonBody);
  const jsonResponse = await response.json();
  const base64ImageData = jsonResponse.result.image;

  const imageBuffer = base64ToArrayBuffer(base64ImageData);

  const key = `image_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  await env.FLUX_CF_KV.put(key, imageBuffer, {
    expirationTtl: CONFIG.IMAGE_EXPIRATION,
    metadata: { contentType: 'image/png' }
  });

  return `${new URL(requestUrl).origin}/image/${key}`;
}

function generateResponseContent(originalPrompt, translatedPrompt, size, model, imageUrl, promptModel) {
  return `🎨 Ursprünglicher Prompt: ${originalPrompt}\n` +
         `💬 Prompt-Generierungsmodell: ${promptModel}\n` +
         `🌐 Übersetzter Prompt: ${translatedPrompt}\n` +
         `📐 Bildspezifikationen: ${size}\n` +
         `🌟 Bilderzeugung erfolgreich!\n` +
         `Hier ist das Ergebnis:\n\n` +
         `![Generiertes Bild](${imageUrl})`;
}

function handleResponse(originalPrompt, translatedPrompt, size, model, imageUrl, promptModel, isStream) {
  const content = generateResponseContent(originalPrompt, translatedPrompt, size, model, imageUrl, promptModel);
  const commonFields = {
    id: `chatcmpl-${Date.now()}`,
    created: Math.floor(Date.now() / 1000),
    model: model
  };

  if (isStream) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          ...commonFields,
          object: "chat.completion.chunk",
          choices: [{ delta: { content: content }, index: 0, finish_reason: null }]
        })}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    const headers = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    addCorsHeaders(headers);
    return new Response(stream, { headers });
  } else {
    const response = {
      ...commonFields,
      object: "chat.completion",
      choices: [{
        index: 0,
        message: { role: "assistant", content },
        finish_reason: "stop"
      }],
      usage: {
        prompt_tokens: translatedPrompt.length,
        completion_tokens: content.length,
        total_tokens: translatedPrompt.length + content.length
      }
    };

    const headers = new Headers({ 'Content-Type': 'application/json' });
    addCorsHeaders(headers);
    return new Response(JSON.stringify(response), { headers });
  }
}

async function handleImageRequest(request, env, ctx) {
  const url = new URL(request.url);
  const key = url.pathname.split('/').pop();
  
  const imageData = await env.FLUX_CF_KV.get(key, 'arrayBuffer');
  if (!imageData) {
    return new Response('Image not found', { status: 404 });
  }

  const headers = new Headers({
    'Content-Type': 'image/png',
    'Cache-Control': 'public, max-age=604800',
  });
  addCorsHeaders(headers);
  return new Response(imageData, { headers });
}

// 辅助函数
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

async function postRequest(model, jsonBody) {
  const apiUrl = `https://api.cloudflare.com/client/v4/accounts/${CONFIG.CF_ACCOUNT_ID}/ai/run/${model}`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CONFIG.CF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonBody)
  });

  if (!response.ok) {
    throw new Error('Cloudflare API request failed: ' + response.status);
  }
  return response;
}

function cleanPromptString(prompt) {
  return prompt.replace(/---n?tl/, "").trim();
}

export default {
  async fetch(request, env, ctx) {
    CONFIG = initConfig(env);
    return handleRequest(request, env, ctx);
  }
};
