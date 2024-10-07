# Flux-API-Worker - README 📘🎨🤖

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)
## Introducción 🌟💡

Flux-API-Worker es un servicio de generación de imágenes con IA desplegado en Cloudflare Workers. Utiliza el modelo Flux proporcionado por Cloudflare para generar imágenes y ofrece una API eficiente para procesar solicitudes. Este servicio se puede integrar fácilmente en diversas aplicaciones, proporcionando a los usuarios potentes capacidades de generación de imágenes con IA. ✨🖼️🚀

## Características 🚀🌈

- 🎨 Soporte para generación de imágenes con prompts personalizados
- 🌐 Función opcional de optimización de prompts
- 📐 Soporte para múltiples tamaños y relaciones de aspecto predefinidas
- 💾 Almacenamiento de imágenes generadas en Cloudflare KV
- 🔄 Soporte para respuestas en streaming y no streaming
- 🔒 Mensajes del sistema incorporados para garantizar una calidad de salida consistente
- 🌍 Soporte para Compartir Recursos de Origen Cruzado (CORS)

## Inicio rápido 🏃‍♂️💨

### Despliegue en el Panel de Cloudflare 🖥️🛠️

1. Inicie sesión en su cuenta de Cloudflare y vaya a la página de Workers. 👨‍💻👩‍💻
2. Haga clic en el botón "Crear servicio". 🆕
3. Asigne un nombre a su Worker, por ejemplo, "flux-api". ✏️
4. En el editor, pegue el código del Worker proporcionado. 📋
5. Haga clic en el botón "Guardar y desplegar". 🚀

### Configuración de variables de entorno ⚙️🔧

En la página de configuración del Worker, busque la sección "Variables de entorno" y añada las siguientes variables:

## Lista de variables de entorno 📋🔑

| Nombre de la variable | Descripción | Tipo | Ejemplo | Valor predeterminado |
|--------|------|------|------|--------|
| `API_KEY` | Clave de autenticación de la API 🔐 | Cadena | `"su-clave-api-compleja-aquí"` | - |
| `CF_ACCOUNT_ID` | ID de cuenta de Cloudflare 🆔 | Cadena | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Token de API de Cloudflare 🎟️ | Cadena | `"su-token-api-de-cloudflare"` | - |
| `PROMPT_OPTIMIZATION` | Habilitar Optimización de Prompt 🌐 | Cadena | `"true"` o `"false"` | - |
| `EXTERNAL_API_BASE` | URL base de la API externa 🔗 | Cadena | `"https://api.servicio-externo.com"` | - |
| `EXTERNAL_MODEL` | Nombre del modelo de optimización externo 🤖 | Cadena | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | Clave de acceso para la API externa 🗝️ | Cadena | `"su-clave-api-externa"` | - |
| `FLUX_NUM_STEPS` | Número de pasos para el modelo Flux 🚶 | Entero | `"4"` | 4 |
| `IMAGE_EXPIRATION` | Tiempo de expiración de las imágenes en KV (segundos) ⏳ | Entero | `"1800"` | 1800 |

Asegúrese de configurar correctamente estas variables en la configuración de variables de entorno de Cloudflare Worker. Para las variables con valores predeterminados, puede mantener la configuración predeterminada si no necesita cambiarla. 🔧✅

> Nota: Por seguridad, establezca una cadena compleja para `API_KEY`. Esto se utilizará para verificar la legitimidad de las llamadas a la API. 🔒🛡️

### Crear un espacio de nombres KV 🗄️📦

1. En el Panel de Cloudflare, vaya a la página "Workers". 🖥️
2. Haga clic en la pestaña "KV". 📑
3. Cree un nuevo espacio de nombres llamado "FLUX_CF_KV". 🆕
4. En la configuración del Worker, vincule este espacio de nombres KV a la variable `FLUX_CF_KV`. 🔗

## Endpoints de la API y funcionalidades 🌐🛠️

### 1. Página de bienvenida 👋

Acceder a la ruta raíz del Worker (`https://<nombre_de_su_worker>.<su_subdominio>.workers.dev/`) mostrará una página de bienvenida, confirmando que el servicio API está en funcionamiento. ✅🏠

### 2. Endpoint de completado de chat 💬

Endpoint principal para la generación de imágenes:
```
https://<nombre_de_su_worker>.<su_subdominio>.workers.dev/v1/chat/completions
```
🎨✨

### 3. Endpoint de información del modelo ℹ️

Obtener información sobre los modelos disponibles:
```
https://<nombre_de_su_worker>.<su_subdominio>.workers.dev/v1/models
```
Este endpoint devuelve información sobre el modelo Flux actualmente en uso. 🤖📊

### 4. Endpoint de obtención de imágenes 🖼️

Obtener imágenes generadas:
```
https://<nombre_de_su_worker>.<su_subdominio>.workers.dev/image/{clave_de_imagen}
```
📥🎭

## Guía de uso 📖🧭

### Generar una imagen 🖼️🎨

Envíe una solicitud POST al endpoint de completado de chat con el siguiente formato:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Un gato adorable 3:2"
    }
  ],
  "stream": false
}
```

Los encabezados de la solicitud deben incluir:

```
Authorization: Bearer SU_CLAVE_API
Content-Type: application/json
```

> Importante: Reemplace `SU_CLAVE_API` con el valor de `API_KEY` que estableció en las variables de entorno. 🔑🔄

### Respuesta en streaming 🌊📡

Si desea recibir una respuesta en streaming, establezca el parámetro `stream` en `true`:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Un gato adorable 3:2"
    }
  ],
  "stream": true
}
```

Las respuestas en streaming se devolverán en formato Server-Sent Events (SSE), permitiendo obtener el progreso de la generación en tiempo real. ⚡🔄

### Tamaños de imagen soportados 📏🖼️

Flux-API-Worker soporta los siguientes tamaños y relaciones de aspecto predefinidos:

- 1:1 (1024x1024) - Tamaño predeterminado 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

Para especificar un tamaño en particular, simplemente añada la relación correspondiente después del prompt, por ejemplo:

```
"Un gato adorable 16:9"
```

Si no se especifica un tamaño, el sistema generará por defecto una imagen de 1:1 (1024x1024). 🎛️🔧

### Soporte para Compartir Recursos de Origen Cruzado (CORS) 🌍🔓

Flux-API-Worker soporta CORS, permitiendo el acceso a la API desde aplicaciones web en diferentes dominios. Esto significa que puede llamar a la API directamente desde aplicaciones JavaScript frontend sin encontrar problemas de origen cruzado. 🔗🚫🚧

### Uso en aplicaciones de terceros 🔗🔌

Flux-API-Worker se puede integrar fácilmente en diversas aplicaciones como NextWeb, ChatBox, etc. Al configurar en estas aplicaciones:

1. Establezca la dirección de la API como la URL de su Worker (endpoint de completado de chat). 🔗
2. Ingrese la CLAVE API que configuró. 🔑
3. No es necesario preocuparse por la configuración del System Message proporcionada por la aplicación, ya que Flux-API-Worker utiliza un System Message incorporado. 💬🚫

> Nota: Flux-API-Worker ha eliminado la funcionalidad de contexto, generando una nueva imagen única en cada llamada. 🆕🖼️

### Formato de respuesta 📤📊

Ejemplo de respuesta no streaming:

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
        "content": "🎨 Prompt original: Un gato adorable 3:2\n💬 Modelo de generación de prompts: Prompt Original\n🌐 Prompt optimizado: Un gato adorable\n📐 Especificaciones de la imagen: 768x512\n🌟 ¡Imagen generada con éxito!\nAquí está el resultado:\n\n![Imagen generada](https://url-de-su-worker.workers.dev/image/12345)"
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

## Consideraciones importantes ⚠️🚨

- Asegúrese de que todas las variables de entorno necesarias estén correctamente configuradas. ✅🔧
- La clave API debe mantenerse segura y no exponerse en el código del cliente. 🔒🙈
- Las imágenes tienen un tiempo de expiración en el almacenamiento KV (30 minutos por defecto), guarde las imágenes importantes a tiempo. ⏳💾
- Si la función de optimización de prompts está habilitada, asegúrese de que la API externa esté configurada correctamente. 🌐🔧
- Al usar respuestas en streaming, asegúrese de que su cliente pueda manejar correctamente los Server-Sent Events. 🌊📡

## Solución de problemas 🔧🚑

1. Si encuentra errores de no autorización, verifique que la clave API esté correctamente configurada y utilizada. 🔑❓
2. Si la generación de imágenes falla, verifique que el Token de API de Cloudflare tenga los permisos correctos. 🎟️🔍
3. Si la optimización de prompts no funciona, asegúrese de que `PROMPT_OPTIMIZATION` esté configurado como 'true' y que la API externa esté correctamente configurada. 🌐🔧
4. Si recibe un error 404, asegúrese de estar accediendo a la ruta de endpoint correcta. 🔍🚷
5. Para otros errores, revise los registros del Worker para obtener información de error más detallada. 📋🔬

## Personalización adicional 🛠️🎨

Puede modificar el código del Worker para optimizar aún más la funcionalidad de la API, por ejemplo:

- Ajustar los tamaños de imagen y relaciones de aspecto soportados 📏✂️
- Modificar los mensajes del sistema incorporados para cambiar el comportamiento de generación de prompts 💬🔄
- Agregar mecanismos adicionales de manejo de errores y registro 🚨📊
- Implementar límites de velocidad personalizados u otras medidas de seguridad 🛡️⏱️

Espero que este README le ayude a desplegar y utilizar rápidamente Flux-API-Worker. Si tiene alguna pregunta o necesita más ayuda, no dude en ponerse en contacto conmigo. 💌👨‍💻👩‍💻

Si este repositorio le ha sido útil, por favor considere darle una estrella. ⭐⭐⭐ ¡Gracias!
