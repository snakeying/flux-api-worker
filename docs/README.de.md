# Flux-API-Worker - README 📘🎨🤖

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

## Einführung 🌟💡

Flux-API-Worker ist ein KI-Bildgenerierungsdienst, der auf Cloudflare Workers bereitgestellt wird. Er nutzt das von Cloudflare bereitgestellte Flux-Modell zur Bilderzeugung und bietet eine effiziente API-Schnittstelle zur Verarbeitung von Anfragen. Dieser Dienst lässt sich einfach in verschiedene Anwendungen integrieren und bietet Benutzern leistungsstarke KI-Bildgenerierungsfähigkeiten. ✨🖼️🚀

## Funktionen 🚀🌈

- 🎨 Unterstützung benutzerdefinierter Prompts zur Bilderzeugung
- 🌐 Optionale Prompt-Übersetzungsfunktion
- 📐 Unterstützung verschiedener voreingestellter Bildgrößen und Seitenverhältnisse
- 💾 Speicherung generierter Bilder mit Cloudflare KV
- 🔄 Unterstützung für Stream- und Nicht-Stream-Antworten
- 🔒 Integrierte Systemnachrichten für konsistente Ausgabequalität
- 🌍 Cross-Origin Resource Sharing (CORS) Unterstützung

## Schnellstart 🏃‍♂️💨

### Bereitstellung im Cloudflare Dashboard 🖥️🛠️

1. Melden Sie sich bei Ihrem Cloudflare-Konto an und gehen Sie zur Workers-Seite. 👨‍💻👩‍💻
2. Klicken Sie auf die Schaltfläche "Dienst erstellen". 🆕
3. Benennen Sie Ihren Worker, z.B. "flux-api". ✏️
4. Fügen Sie den bereitgestellten Worker-Code in den Editor ein. 📋
5. Klicken Sie auf die Schaltfläche "Speichern und bereitstellen". 🚀

### Umgebungsvariablen einrichten ⚙️🔧

Finden Sie im Einstellungsbereich Ihres Workers den Abschnitt "Umgebungsvariablen" und fügen Sie die folgenden Variablen hinzu:

## Liste der Umgebungsvariablen 📋🔑

| Variablenname | Beschreibung | Typ | Beispiel | Standardwert |
|---------------|--------------|-----|----------|--------------|
| `API_KEY` | API-Authentifizierungsschlüssel 🔐 | Zeichenkette | `"your-complex-api-key-here"` | - |
| `CF_ACCOUNT_ID` | Cloudflare-Konto-ID 🆔 | Zeichenkette | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Cloudflare API-Token 🎟️ | Zeichenkette | `"your-cloudflare-api-token"` | - |
| `CF_IS_TRANSLATE` | Prompt-Übersetzung aktivieren 🌐 | Zeichenkette | `"true"` oder `"false"` | - |
| `EXTERNAL_API_BASE` | Basis-URL der externen API 🔗 | Zeichenkette | `"https://api.external-service.com"` | - |
| `EXTERNAL_MODEL` | Name des externen Übersetzungsmodells 🤖 | Zeichenkette | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | Zugriffsschlüssel für externe API 🗝️ | Zeichenkette | `"your-external-api-key"` | - |
| `FLUX_NUM_STEPS` | Anzahl der Schritte für das Flux-Modell 🚶 | Ganzzahl | `"4"` | 4 |
| `IMAGE_EXPIRATION` | Ablaufzeit der Bilder im KV (in Sekunden) ⏳ | Ganzzahl | `"1800"` | 1800 |

Stellen Sie sicher, dass Sie diese Variablen in den Umgebungsvariablen-Einstellungen Ihres Cloudflare Workers korrekt konfigurieren. Für Variablen mit Standardwerten können Sie die Standardeinstellungen beibehalten, wenn keine Änderungen erforderlich sind. 🔧✅

> Hinweis: Aus Sicherheitsgründen sollten Sie für `API_KEY` eine komplexe Zeichenfolge festlegen. Diese wird zur Überprüfung der Gültigkeit von API-Aufrufen verwendet. 🔒🛡️

### KV-Namespace erstellen 🗄️📦

1. Gehen Sie im Cloudflare Dashboard zur Seite "Workers". 🖥️
2. Klicken Sie auf die Registerkarte "KV". 📑
3. Erstellen Sie einen neuen Namespace mit dem Namen "FLUX_CF_KV". 🆕
4. Binden Sie in den Worker-Einstellungen diesen KV-Namespace an die Variable `FLUX_CF_KV`. 🔗

## API-Endpunkte und Funktionen 🌐🛠️

### 1. Willkommensseite 👋

Der Zugriff auf den Root-Pfad des Workers (`https://<your_worker_name>.<your_subdomain>.workers.dev/`) zeigt eine Willkommensseite an, die bestätigt, dass der API-Dienst läuft. ✅🏠

### 2. Chat-Completion-Endpunkt 💬

Hauptendpunkt für die Bilderzeugung:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/chat/completions
```
🎨✨

### 3. Modellinformations-Endpunkt ℹ️

Abrufen von Informationen zu verfügbaren Modellen:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/v1/models
```
Dieser Endpunkt gibt Informationen über das aktuell verwendete Flux-Modell zurück. 🤖📊

### 4. Bildabruf-Endpunkt 🖼️

Abrufen generierter Bilder:
```
https://<your_worker_name>.<your_subdomain>.workers.dev/image/{image_key}
```
📥🎭

## Bedienungsanleitung 📖🧭

### Bild generieren 🖼️🎨

Senden Sie eine POST-Anfrage an den Chat-Completion-Endpunkt im folgenden Format:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Eine niedliche Katze 3:2"
    }
  ],
  "stream": false
}
```

Der Anfrage-Header muss Folgendes enthalten:

```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

> Wichtig: Ersetzen Sie `YOUR_API_KEY` durch den Wert, den Sie in den Umgebungsvariablen für `API_KEY` festgelegt haben. 🔑🔄

### Stream-Antwort 🌊📡

Wenn Sie eine Stream-Antwort erhalten möchten, setzen Sie den `stream`-Parameter auf `true`:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Eine niedliche Katze 3:2"
    }
  ],
  "stream": true
}
```

Stream-Antworten werden im Server-Sent Events (SSE) Format zurückgegeben, wodurch ein Echtzeit-Fortschritt der Generierung möglich ist. ⚡🔄

### Unterstützte Bildgrößen 📏🖼️

Flux-API-Worker unterstützt die folgenden voreingestellten Bildgrößen und Seitenverhältnisse:

- 1:1 (1024x1024) - Standardgröße 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

Um eine bestimmte Größe anzugeben, fügen Sie einfach das entsprechende Verhältnis am Ende des Prompts hinzu, zum Beispiel:

```
"Eine niedliche Katze 16:9"
```

Wenn keine Größe angegeben wird, generiert das System standardmäßig ein 1:1 (1024x1024) Bild. 🎛️🔧

### Cross-Origin Resource Sharing (CORS) Unterstützung 🌍🔓

Flux-API-Worker unterstützt CORS, wodurch der Zugriff auf die API von Webanwendungen aus verschiedenen Domains ermöglicht wird. Das bedeutet, Sie können die API direkt in Frontend-JavaScript-Anwendungen aufrufen, ohne auf Probleme mit Cross-Origin-Anfragen zu stoßen. 🔗🚫🚧

### Verwendung in Drittanbieter-Anwendungen 🔗🔌

Flux-API-Worker lässt sich einfach in verschiedene Anwendungen wie NextWeb, ChatBox usw. integrieren. Bei der Konfiguration in diesen Anwendungen:

1. Setzen Sie die API-Adresse auf Ihre Worker-URL (Chat-Completion-Endpunkt). 🔗
2. Geben Sie den von Ihnen festgelegten API-KEY ein. 🔑
3. Ignorieren Sie die von der Anwendung bereitgestellte Einstellung für System Message, da Flux-API-Worker eine integrierte System Message verwendet. 💬🚫

> Hinweis: Flux-API-Worker hat die Kontextfunktion entfernt. Jeder Aufruf generiert ein neues, einzigartiges Bild. 🆕🖼️

### Antwortformat 📤📊

Beispiel einer Nicht-Stream-Antwort:

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
        "content": "🎨 Originaler Prompt: Eine niedliche Katze 3:2\n💬 Prompt-Generierungsmodell: Original Prompt\n🌐 Übersetzter Prompt: Eine niedliche Katze\n📐 Bildspezifikation: 768x512\n🌟 Bild erfolgreich generiert!\nHier ist das Ergebnis:\n\n![Generiertes Bild](https://your-worker-url.workers.dev/image/12345)"
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

## Wichtige Hinweise ⚠️🚨

- Stellen Sie sicher, dass alle erforderlichen Umgebungsvariablen korrekt eingerichtet sind. ✅🔧
- Der API-Schlüssel sollte sicher aufbewahrt und nicht im Client-Code offengelegt werden. 🔒🙈
- Bilder haben eine Ablaufzeit im KV-Speicher (standardmäßig 30 Minuten). Speichern Sie wichtige Bilder rechtzeitig. ⏳💾
- Wenn Sie die Prompt-Übersetzungsfunktion aktivieren, stellen Sie sicher, dass die externe API korrekt konfiguriert ist. 🌐🔧
- Bei Verwendung von Stream-Antworten stellen Sie sicher, dass Ihr Client Server-Sent Events korrekt verarbeiten kann. 🌊📡

## Fehlerbehebung 🔧🚑

1. Bei Nicht-Autorisierungsfehlern überprüfen Sie, ob der API-Schlüssel korrekt eingerichtet und verwendet wird. 🔑❓
2. Wenn die Bilderzeugung fehlschlägt, überprüfen Sie, ob das Cloudflare API-Token die richtigen Berechtigungen hat. 🎟️🔍
3. Wenn die Prompt-Übersetzung nicht funktioniert, vergewissern Sie sich, dass `CF_IS_TRANSLATE` auf 'true' gesetzt ist und die externe API-Konfiguration korrekt ist. 🌐🔧
4. Bei 404-Fehlern stellen Sie sicher, dass Sie den richtigen Endpunkt-Pfad aufrufen. 🔍🚷
5. Für andere Fehler überprüfen Sie die Worker-Logs für detailliertere Fehlermeldungen. 📋🔬

## Weitere Anpassungen 🛠️🎨

Sie können den Worker-Code modifizieren, um die API-Funktionalität weiter zu optimieren, zum Beispiel:

- Anpassen der unterstützten Bildgrößen und Seitenverhältnisse 📏✂️
- Ändern der integrierten Systemnachrichten, um das Verhalten der Prompt-Generierung zu beeinflussen 💬🔄
- Hinzufügen zusätzlicher Fehlerbehandlungs- und Protokollierungsmechanismen 🚨📊
- Implementieren benutzerdefinierter Ratenbegrenzungen oder anderer Sicherheitsmaßnahmen 🛡️⏱️

Ich hoffe, dieses README hilft Ihnen bei der schnellen Bereitstellung und Nutzung von Flux-API-Worker. Wenn Sie Fragen haben oder weitere Hilfe benötigen, zögern Sie nicht, mich zu kontaktieren. 💌👨‍💻👩‍💻

Wenn Sie finden, dass dieses Repo Ihnen geholfen hat, geben Sie mir bitte einen Stern. ⭐⭐⭐ Vielen Dank!
