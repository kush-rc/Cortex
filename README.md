# 🧠 Cortex — AI-Powered Electronics Store

> A full-stack Apple-inspired electronics store with an integrated AI shopping assistant (GIZMO) powered by **Llama 3.2 3B** — running locally via llama-cpp-python for development, and served via **Groq API** for the live deployment.

---

## ✨ Features

### 🛒 E-Commerce Platform
- **Apple-inspired UI** — Premium dark/light design system built with vanilla CSS
- **Product catalog** with categories: iPhone, Mac, iPad, Apple Watch, AirPods, Apple TV, HomePod
- **Product detail pages** with image galleries, color pickers, and configurable specs (chip, storage, memory)
- **Smart comparison** — Side-by-side product comparison with deep spec tables
- **Shopping cart** with real-time pricing based on selected configurations
- **Checkout flow** with address selection and order placement
- **Order tracking** with delivery status and history
- **User authentication** (JWT + bcrypt) with login, signup, forgot password
- **User profiles** with order history, support tickets, and saved preferences

### 🤖 GIZMO AI Assistant
- **Dual inference backend** — Llama 3.2 3B (Q4 quantized) via llama-cpp-python locally; **Groq API** in production for fast cloud inference
- **Product-aware** — RAG (Retrieval-Augmented Generation) injects real product specs from MongoDB into every response
- **Smart recommendations** — Opinionated suggestions based on actual specs (battery life, chip power, etc.)
- **Inline comparison** — Generates clickable "Compare" buttons that open the full comparison page
- **Cross-category blocking** — Prevents nonsensical comparisons (iPhone vs Mac) at the code level
- **Dynamic spec injection** — Parses user queries to identify mentioned products and fetches their full specs
- **Order & ticket awareness** — Knows the user's orders, delivery status, and support tickets
- **Security guardrails** — Won't reveal passwords, emails, payment info, or its own system prompt
- **Ticket creation** — Users can raise support tickets directly through the chatbot
- **Persistent memory** — Chat history stored in MongoDB, preferences learned over time
- **N/A field stripping** — Post-processes responses to remove hallucinated empty specs

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    cortex-ui (Vite + React)              │
│  ┌──────┐ ┌──────────┐ ┌─────────┐ ┌────────────────┐  │
│  │ Home │ │ Product  │ │ Compare │ │  Chat Widget    │  │
│  │      │ │ Detail   │ │ Page    │ │  (GIZMO Panel)  │  │
│  └──────┘ └──────────┘ └─────────┘ └────────────────┘  │
│            ↕ REST API (fetch)                           │
├─────────────────────────────────────────────────────────┤
│                gizmo (Python Flask Backend)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │ chat_api │ │ auth_api │ │ cart_api │ │ orders_api│  │
│  └────┬─────┘ └──────────┘ └──────────┘ └───────────┘  │
│       │                                                  │
│  ┌────▼────────────────────────────────────────────┐    │
│  │            LLM Inference Layer                   │    │
│  │  Dev:  llama-cpp-python (Llama 3.2 3B Q4 GGUF) │    │
│  │  Prod: Groq API (llama-3.2-3b-preview)          │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│                MongoDB (Local / Atlas)                   │
│  ┌──────────┐ ┌───────┐ ┌────────┐ ┌────────────────┐  │
│  │ products │ │ users │ │ orders │ │ chat_history   │  │
│  └──────────┘ └───────┘ └────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18, Vite 5, React Router 6 | SPA with Apple-inspired UI |
| **Backend** | Python Flask, Flask-CORS, Flask-JWT-Extended | REST APIs for products, auth, cart, orders, chat |
| **Database** | MongoDB + PyMongo | Products, users, orders, chat history, tickets |
| **AI (Dev)** | Llama 3.2 3B (GGUF Q4) via llama-cpp-python | Locally-running LLM for development |
| **AI (Prod)** | Llama 3.2 3B via Groq API | Fast cloud inference for live deployment |
| **Auth** | JWT + Flask-Bcrypt | Secure user authentication |
| **Styling** | Vanilla CSS, CSS Custom Properties | Apple-inspired design system |

---

## 🤖 AI Model Parameters

| Parameter | Local (Dev) | Production |
|-----------|-------------|------------|
| **Model** | `llama-3.2-3b-q4.gguf` | `llama-3.2-3b-preview` via Groq |
| **Inference** | llama-cpp-python | Groq API |
| **Context Window** | 8192 tokens | 8192 tokens |
| **Max Output** | 512 tokens | 512 tokens |
| **Temperature** | 0.1 | 0.1 |
| **GPU Layers** | -1 (full offload) | Managed by Groq |

### AI Safety & Guardrails
- **Cross-category comparison blocking** — Hardcoded Python check prevents comparing iPhones with Macs
- **Anti-hallucination** — N/A fields stripped from context AND post-processed from output
- **Prompt injection protection** — Rejects "ignore rules", "pretend", "roleplay" instructions
- **PII protection** — Never reveals passwords, emails, payment methods, or addresses
- **Topic guard** — Only answers questions about Cortex products, orders, and support

---

## 📁 Project Structure

```
Cortex/
├── cortex-ui/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWidget/       # GIZMO AI chat panel
│   │   │   ├── CompareBar/       # Product comparison bar
│   │   │   ├── Navbar.jsx        # Navigation
│   │   │   ├── HeroSection.jsx   # Homepage hero
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Store.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── context/
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── gizmo/                        # Python Backend (Flask)
│   ├── api/
│   │   ├── chat_api.py           # Main Flask app (all routes + GIZMO AI)
│   │   ├── auth_api.py           # Login, signup, JWT auth
│   │   ├── cart_api.py           # Cart CRUD
│   │   └── orders_api.py         # Order placement + tracking
│   ├── core/
│   │   └── llama_client.py       # LLM client (Groq API in prod / llama-cpp locally)
│   ├── config/
│   │   └── settings.py           # App configuration + env vars
│   ├── data/
│   │   ├── prompts/
│   │   │   └── base_prompt.txt   # GIZMO system prompt
│   │   └── seed_apple_products.py
│   ├── static/                   # Product images
│   ├── models/                   # GGUF model file (local dev only, gitignored)
│   └── requirements.txt
│
├── imgs/
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas)
- Groq API key (for production) — free at [console.groq.com](https://console.groq.com)
- GPU recommended (for local llama-cpp-python inference only)

### 1. Clone the repository
```bash
git clone https://github.com/kush-rc/Cortex.git
cd Cortex
```

### 2. Backend Setup
```bash
cd gizmo
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

### 3. Set Environment Variables
Create a `.env` file inside `gizmo/`:
```env
# For production (Groq API)
GROQ_API_KEY=your_groq_api_key_here

# For local dev (llama-cpp-python) — optional
USE_LOCAL_MODEL=true

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=AllItemDetails

# Flask
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True
```

### 4. Seed the Database
```bash
python data/seed_apple_products.py
```

### 5. Start the Backend
```bash
python api/chat_api.py
# Runs on http://localhost:5000
```

### 6. Frontend Setup
```bash
cd ../cortex-ui
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=iphone` | Filter by category |
| GET | `/api/products/<id>` | Get by ID |
| GET | `/api/products/compare?ids=name1,name2` | Compare products |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login + get JWT |
| GET | `/api/auth/me` | Get current user |

### Chat (GIZMO)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to GIZMO |
| GET | `/api/chat/history` | Get chat history |
| DELETE | `/api/chat/history` | Clear chat history |

### Cart & Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/DELETE | `/api/cart` | Cart CRUD |
| POST | `/api/orders` | Place order |
| GET | `/api/orders` | Get user's orders |

---

## 🗺️ Future Roadmap
- [ ] Streaming responses (Server-Sent Events)
- [ ] Voice input for GIZMO
- [ ] Product reviews & ratings
- [ ] Wishlist functionality
- [ ] Email notifications for orders
- [ ] Admin dashboard

---

## 📄 Legal & Disclaimer
Cortex is a mock e-commerce portfolio project for educational purposes only. All product names and brands (Apple, iPhone, Mac, iPad, etc.) are property of their respective owners. No real products are sold and no real transactions occur. Not affiliated with or endorsed by Apple Inc.
