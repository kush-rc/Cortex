# 🚀 Cortex Deployment Guide

Free deployment using Vercel + Render + MongoDB Atlas + Groq API.

---

## Prerequisites
- GitHub account with the repo pushed
- Vercel account (free) — https://vercel.com
- Render account (free) — https://render.com
- MongoDB Atlas account (free) — https://cloud.mongodb.com
- Groq account (free) — https://console.groq.com

---

## Step 1: MongoDB Atlas (Free Database)

1. Go to https://cloud.mongodb.com → Sign up / Log in
2. Click **"Build a Database"** → Choose **M0 Free Tier**
3. Select your nearest region → Click **Create**
4. Create a database user (username + password)
5. Under **Network Access** → Add `0.0.0.0/0` (allow all IPs for deployment)
6. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/cortex_store
   ```
7. **Seed the database**: Update your local `.env` with the Atlas URI, then run:
   ```bash
   cd gizmo
   python data/seed_apple_products.py
   ```

---

## Step 2: Groq API (Free AI — Replaces Local Model)

> **Why?** Free hosting services have 512MB RAM limits. Your local GGUF model is 2GB and won't fit. Groq provides Llama 3.2 3B via API for free at ~500 tokens/sec.

1. Go to https://console.groq.com → Sign up
2. Click **API Keys** → Create new key → Copy it
3. Free tier: **30 requests/minute** with Llama 3.2

### Code Change for Deployment

Add this to `gizmo/core/llama_client.py` — a `GroqClient` class that uses the API:

```python
import os
import requests

class GroqClient:
    """Groq API client as a drop-in replacement for local LlamaClient."""

    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = "llama-3.2-3b-preview"
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, prompt, system=None, max_tokens=512, history=None):
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        if history:
            for msg in history:
                if isinstance(msg, dict) and "role" in msg and "content" in msg:
                    messages.append({"role": msg["role"], "content": msg["content"]})
        messages.append({"role": "user", "content": prompt})

        response = requests.post(
            self.base_url,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": self.model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": 0.1
            },
            timeout=30
        )
        data = response.json()
        return data["choices"][0]["message"]["content"]

    def load(self):
        pass  # No loading needed for API

    def is_loaded(self):
        return bool(self.api_key)
```

Then in `chat_api.py`, swap the client based on environment:
```python
# At the top of chat_api.py
USE_GROQ = os.getenv("USE_GROQ", "false").lower() == "true"

if USE_GROQ:
    from core.llama_client import GroqClient
    def get_llama_client():
        return GroqClient()
```

---

## Step 3: Render (Free Backend Hosting)

1. Go to https://render.com → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name**: `cortex-api`
   - **Root Directory**: `gizmo`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn api.chat_api:app --bind 0.0.0.0:$PORT`
4. **Environment Variables**:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/cortex_store
   JWT_SECRET_KEY = your-secret-key-here
   GROQ_API_KEY = your-groq-api-key
   USE_GROQ = true
   FLASK_ENV = production
   ```
5. Click **Create Web Service**
6. Your API will be at: `https://cortex-api.onrender.com`

> **Note**: Add `gunicorn` to your `requirements.txt` before deploying:
> ```
> gunicorn==22.0.0
> ```

---

## Step 4: Vercel (Free Frontend Hosting)

1. Go to https://vercel.com → **Add New Project** → Import GitHub repo
2. Configure:
   - **Root Directory**: `cortex-ui`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL = https://cortex-api.onrender.com
   ```
4. Click **Deploy**
5. Your site will be at: `https://cortex.vercel.app`

### Update `vite.config.js` for Production

Update the proxy to use the environment variable:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

In your frontend API calls, update the base URL:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '';
fetch(`${API_URL}/api/products`)
```

---

## Environment Variables Checklist

### Render (Backend)
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your Atlas connection string |
| `JWT_SECRET_KEY` | Any random secret string |
| `GROQ_API_KEY` | From console.groq.com |
| `USE_GROQ` | `true` |
| `FLASK_ENV` | `production` |

### Vercel (Frontend)
| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render API URL |

---

## Cost Summary

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| MongoDB Atlas | M0 | **Free** | 512MB storage |
| Render | Free | **Free** | 750 hrs/month, sleeps after 15min inactivity |
| Vercel | Hobby | **Free** | Unlimited for personal projects |
| Groq | Free | **Free** | 30 requests/minute |
| **Total** | | **$0/month** | |

> **Note**: Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.
