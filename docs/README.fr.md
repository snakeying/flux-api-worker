# Flux-API-Worker - README 📘🎨🤖

[English](../README.md) | [简体中文](./README.zh-cn.md) | [繁體中文](./README.zh-hant.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Русский](./README.ru.md) | [Deutsch](./README.de.md)

## Introduction 🌟💡

Flux-API-Worker est un service de génération d'images IA déployé sur Cloudflare Worker. Il utilise le modèle Flux fourni par Cloudflare pour générer des images et offre une interface API efficace pour traiter les requêtes. Ce service peut être facilement intégré dans diverses applications pour fournir aux utilisateurs de puissantes capacités de génération d'images IA. ✨🖼️🚀

## Caractéristiques 🚀🌈

- 🎨 Génération d'images à partir de prompts personnalisés
- 🌐 Fonction optionnelle de traduction des prompts
- 📐 Prise en charge de plusieurs tailles et ratios d'image prédéfinis
- 💾 Stockage des images générées avec Cloudflare KV
- 🔄 Prise en charge des réponses en continu (streaming) et non-streaming
- 🔒 Messages système intégrés pour assurer une qualité de sortie cohérente
- 🌍 Prise en charge du partage de ressources entre origines (CORS)

## Démarrage rapide 🏃‍♂️💨

### Déploiement dans le tableau de bord Cloudflare 🖥️🛠️

1. Connectez-vous à votre compte Cloudflare et accédez à la page Workers. 👨‍💻👩‍💻
2. Cliquez sur le bouton "Créer un service". 🆕
3. Nommez votre Worker, par exemple "flux-api". ✏️
4. Collez le code du Worker fourni dans l'éditeur. 📋
5. Cliquez sur le bouton "Enregistrer et déployer". 🚀

### Configuration des variables d'environnement ⚙️🔧

Dans la page des paramètres du Worker, trouvez la section "Variables d'environnement" et ajoutez les variables suivantes :

## Liste des variables d'environnement 📋🔑

| Nom de la variable | Description | Type | Exemple | Valeur par défaut |
|--------------------|-------------|------|---------|-------------------|
| `API_KEY` | Clé d'authentification API 🔐 | Chaîne | `"votre-clé-api-complexe-ici"` | - |
| `CF_ACCOUNT_ID` | ID du compte Cloudflare 🆔 | Chaîne | `"1a2b3c4d5e6f7g8h9i0j"` | - |
| `CF_API_TOKEN` | Jeton API Cloudflare 🎟️ | Chaîne | `"votre-jeton-api-cloudflare"` | - |
| `PROMPT_OPTIMIZATION` | Activer l'optimisation du prompt 🌐 | Chaîne | `"true"` ou `"false"` | - |
| `EXTERNAL_API_BASE` | URL de base de l'API externe 🔗 | Chaîne | `"https://api.service-externe.com"` | - |
| `EXTERNAL_MODEL` | Nom du modèle de traduction externe 🤖 | Chaîne | `"gpt-3.5-turbo"` | - |
| `EXTERNAL_API_KEY` | Clé d'accès pour l'API externe 🗝️ | Chaîne | `"votre-clé-api-externe"` | - |
| `FLUX_NUM_STEPS` | Nombre d'étapes pour le modèle Flux 🚶 | Entier | `"4"` | 4 |
| `IMAGE_EXPIRATION` | Durée d'expiration des images dans KV (secondes) ⏳ | Entier | `"1800"` | 1800 |

Assurez-vous de configurer correctement ces variables dans les paramètres des variables d'environnement de votre Cloudflare Worker. Pour les variables ayant des valeurs par défaut, vous pouvez conserver ces valeurs si aucun changement n'est nécessaire. 🔧✅

> Note : Pour des raisons de sécurité, définissez une chaîne complexe pour `API_KEY`. Elle sera utilisée pour valider la légitimité des appels API. 🔒🛡️

### Création d'un espace de noms KV 🗄️📦

1. Dans le tableau de bord Cloudflare, allez sur la page "Workers". 🖥️
2. Cliquez sur l'onglet "KV". 📑
3. Créez un nouvel espace de noms appelé "FLUX_CF_KV". 🆕
4. Dans les paramètres du Worker, liez cet espace de noms KV à la variable `FLUX_CF_KV`. 🔗

## Points d'accès API et fonctionnalités 🌐🛠️

### 1. Page d'accueil 👋

L'accès à la racine du Worker (`https://<nom_de_votre_worker>.<votre_sous-domaine>.workers.dev/`) affichera une page d'accueil confirmant que le service API est opérationnel. ✅🏠

### 2. Point d'accès de complétion de chat 💬

Point d'accès principal pour la génération d'images :
```
https://<nom_de_votre_worker>.<votre_sous-domaine>.workers.dev/v1/chat/completions
```
🎨✨

### 3. Point d'accès d'information sur le modèle ℹ️

Pour obtenir des informations sur les modèles disponibles :
```
https://<nom_de_votre_worker>.<votre_sous-domaine>.workers.dev/v1/models
```
Ce point d'accès renvoie des informations sur le modèle Flux actuellement utilisé. 🤖📊

### 4. Point d'accès de récupération d'image 🖼️

Pour récupérer une image générée :
```
https://<nom_de_votre_worker>.<votre_sous-domaine>.workers.dev/image/{image_key}
```
📥🎭

## Guide d'utilisation 📖🧭

### Génération d'images 🖼️🎨

Envoyez une requête POST au point d'accès de complétion de chat avec le format suivant :

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Un chat mignon 3:2"
    }
  ],
  "stream": false
}
```

Les en-têtes de requête doivent inclure :

```
Authorization: Bearer VOTRE_CLE_API
Content-Type: application/json
```

> Important : Remplacez `VOTRE_CLE_API` par la valeur de `API_KEY` que vous avez définie dans les variables d'environnement. 🔑🔄

### Réponse en continu 🌊📡

Si vous souhaitez recevoir une réponse en continu, définissez le paramètre `stream` sur `true` :

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Un chat mignon 3:2"
    }
  ],
  "stream": true
}
```

Les réponses en continu seront renvoyées au format Server-Sent Events (SSE), permettant d'obtenir la progression de la génération en temps réel. ⚡🔄

### Tailles d'image prises en charge 📏🖼️

Flux-API-Worker prend en charge les tailles et ratios d'image prédéfinis suivants :

- 1:1 (1024x1024) - Taille par défaut 🟦
- 1:2 (512x1024) 📱
- 3:2 (768x512) 🖼️
- 3:4 (768x1024) 📱
- 16:9 (1024x576) 🖥️
- 9:16 (576x1024) 📱

Pour spécifier une taille particulière, ajoutez simplement le ratio correspondant après le prompt, par exemple :

```
"Un chat mignon 16:9"
```

Si aucune taille n'est spécifiée, le système générera par défaut une image de 1:1 (1024x1024). 🎛️🔧

### Prise en charge du partage de ressources entre origines (CORS) 🌍🔓

Flux-API-Worker prend en charge CORS, permettant l'accès à l'API depuis des applications web sur différents domaines. Cela signifie que vous pouvez appeler l'API directement depuis des applications JavaScript frontend sans rencontrer de problèmes de cross-origin. 🔗🚫🚧

### Utilisation dans des applications tierces 🔗🔌

Flux-API-Worker peut être facilement intégré dans diverses applications telles que NextWeb, ChatBox, etc. Lors de la configuration dans ces applications :

1. Définissez l'adresse API sur l'URL de votre Worker (point d'accès de complétion de chat). 🔗
2. Entrez l'API KEY que vous avez définie. 🔑
3. Inutile de tenir compte des paramètres System Message fournis par l'application, car le Flux-API-Worker utilise un System Message intégré. 💬🚫

> Note : Flux-API-Worker a supprimé la fonctionnalité de contexte, chaque appel générera une nouvelle image unique. 🆕🖼️

### Format de réponse 📤📊

Exemple de réponse non-streaming :

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
        "content": "🎨 Prompt original : Un chat mignon 3:2\n💬 Modèle de génération de prompt : Original Prompt\n🌐 Prompt traduit : Un chat mignon\n📐 Spécifications de l'image : 768x512\n🌟 Image générée avec succès !\nVoici le résultat :\n\n![Image générée](https://url-de-votre-worker.workers.dev/image/12345)"
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

## Points importants ⚠️🚨

- Assurez-vous que toutes les variables d'environnement nécessaires sont correctement configurées. ✅🔧
- La clé API doit être conservée en sécurité et ne pas être exposée dans le code client. 🔒🙈
- Les images ont une durée d'expiration dans le stockage KV (30 minutes par défaut), sauvegardez rapidement les images importantes. ⏳💾
- Si la fonction de traduction des prompts est activée, assurez-vous que l'API externe est correctement configurée. 🌐🔧
- Lors de l'utilisation des réponses en continu, assurez-vous que votre client peut traiter correctement les Server-Sent Events. 🌊📡

## Dépannage 🔧🚑

1. En cas d'erreur d'autorisation, vérifiez que la clé API est correctement définie et utilisée. 🔑❓
2. Si la génération d'image échoue, vérifiez que le jeton API Cloudflare a les bonnes permissions. 🎟️🔍
3. Si la traduction des prompts ne fonctionne pas, confirmez que `CF_IS_TRANSLATE` est défini sur 'true' et que la configuration de l'API externe est correcte. 🌐🔧
4. Si vous recevez une erreur 404, assurez-vous d'accéder au bon chemin de point d'accès. 🔍🚷
5. Pour d'autres erreurs, consultez les logs du Worker pour obtenir des informations d'erreur plus détaillées. 📋🔬

## Personnalisation avancée 🛠️🎨

Vous pouvez modifier le code du Worker pour optimiser davantage les fonctionnalités de l'API, par exemple :

- Ajuster les tailles et ratios d'image pris en charge 📏✂️
- Modifier les messages système intégrés pour changer le comportement de génération de prompts 💬🔄
- Ajouter des mécanismes supplémentaires de gestion des erreurs et de journalisation 🚨📊
- Implémenter des limites de taux personnalisées ou d'autres mesures de sécurité 🛡️⏱️

J'espère que ce README vous aidera à déployer et utiliser rapidement Flux-API-Worker. Si vous avez des questions ou besoin d'aide supplémentaire, n'hésitez pas à me contacter. 💌👨‍💻👩‍💻

Si vous trouvez ce repo utile, n'hésitez pas à lui donner une étoile. ⭐⭐⭐ Merci !
