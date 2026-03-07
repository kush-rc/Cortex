# 🤖 GIZMO

> *Gadget Intelligence Zoned for Maximum Optimization*

AI-powered shopping assistant for Cortex e-commerce platform.

## 🧠 Features

- **Product Q&A**: Instant answers about specs, pricing, comparisons
- **Order Tracking**: "Where is my order?" with real-time status
- **Smart Suggestions**: Context-aware quick questions
- **Natural Conversation**: Powered by Ollama LLM

## 🏗️ Architecture

```
gizmo/
├── api/                 # Flask REST API
│   └── chat_api.py
├── core/                # AI Logic
│   ├── ollama_client.py     # LLM interface
│   ├── intent_classifier.py # Fast intent detection
│   ├── context_builder.py   # Product context
│   └── response_generator.py
├── config/
│   └── settings.py
├── data/
│   ├── prompts/         # System prompts
│   └── training/        # NLU training data
└── tests/
```

## 🚀 Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Install Ollama (if not installed)
# https://ollama.ai/download

# Pull model
ollama pull llama3.2:3b

# Run API
python api/chat_api.py
```

## 📡 API

### POST /api/chat
```json
{
  "message": "What's the battery life?",
  "user_id": "user123",
  "product_context": {"name": "iPhone 15", "category": "phone"}
}
```

### Response
```json
{
  "response": "The iPhone 15 has up to 29 hours of video playback...",
  "intent": "product_specs",
  "confidence": 0.95
}
```

## 🔧 Configuration

Set in `config/settings.py`:
- `OLLAMA_MODEL`: LLM model (default: llama3.2:3b)
- `MONGODB_URI`: Database connection
- `FLASK_PORT`: API port (default: 5000)
