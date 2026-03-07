# 🧠 Cortex — AI-Powered Electronics Store

> A full-stack Apple-inspired electronics store with an integrated AI shopping assistant (GIZMO) powered by a locally-running Llama 3.2 3B language model.

<!-- Add your screenshots here -->
<!-- ![Cortex Homepage](screenshots/homepage.png) -->

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
- **Locally-running LLM** — Llama 3.2 3B (Q4 quantized) via llama-cpp-python. No external API calls.
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
│  ┌────▼──────────────────────────────┐                  │
│  │   LlamaClient (llama-cpp-python)  │                  │
│  │   Model: Llama 3.2 3B Q4 (GGUF)  │                  │
│  │   n_ctx=8192 | temp=0.1 | GPU    │                  │
│  └───────────────────────────────────┘                  │
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
| **AI Model** | Llama 3.2 3B (GGUF Q4) via llama-cpp-python | Locally-running LLM for shopping assistant |
| **Auth** | JWT + Flask-Bcrypt | Secure user authentication |
| **Styling** | Vanilla CSS, CSS Custom Properties | Apple-inspired design system |

---

## 🤖 AI Model Parameters

| Parameter | Value | Reasoning |
|-----------|-------|-----------|
| **Model** | `llama-3.2-3b-q4.gguf` | Best balance of speed and quality for local inference |
| **Context Window** (`n_ctx`) | 8192 tokens | Fits system prompt + product catalog + specs + 4-message history |
| **Max Output** (`max_tokens`) | 512 tokens | Enough for detailed comparisons without cut-off |
| **Temperature** | 0.1 | Near-deterministic for accurate, factual product info |
| **GPU Layers** (`n_gpu_layers`) | -1 (all) | Full GPU offload for maximum speed |
| **Batch Size** (`n_batch`) | 512 | Faster prompt processing (512 tokens at once) |
| **Flash Attention** | Enabled | Memory-efficient attention computation |
| **History Window** | 4 messages | Context awareness for follow-up questions |

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
│   │   │   └── ...               # Product cards, layouts, etc.
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Store.jsx         # Product listing
│   │   │   ├── ProductDetail.jsx # Product detail + buy
│   │   │   ├── ComparePage.jsx   # Side-by-side comparison
│   │   │   ├── Cart.jsx          # Shopping cart
│   │   │   ├── Checkout.jsx      # Checkout flow
│   │   │   ├── Profile.jsx       # User profile + orders
│   │   │   └── ...               # Auth pages, support, etc.
│   │   ├── context/              # React contexts (Auth, Compare)
│   │   └── App.jsx               # Router + layout
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
│   │   └── llama_client.py       # LlamaClient wrapper (model loading + generation)
│   ├── config/
│   │   └── settings.py           # App configuration
│   ├── data/
│   │   ├── prompts/
│   │   │   └── base_prompt.txt   # GIZMO system prompt
│   │   └── seed_apple_products.py # Full Apple product catalog (seed data)
│   ├── static/                   # Product images
│   ├── models/                   # GGUF model file (gitignored)
│   └── requirements.txt
│
├── imgs/                         # Reference images
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** (local or Atlas)
- **GPU recommended** (NVIDIA with CUDA for faster inference)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/cortex.git
cd cortex
```

### 2. Backend Setup
```bash
cd gizmo

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Download the AI model (2GB)
# Place llama-3.2-3b-q4.gguf in gizmo/models/
```

### 3. Seed the Database
```bash
# Make sure MongoDB is running on localhost:27017
python data/seed_apple_products.py
```

### 4. Start the Backend
```bash
python api/chat_api.py
# Server runs on http://localhost:5000
```

### 5. Frontend Setup
```bash
cd ../cortex-ui
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 📡 API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?category=iphone` | Get by category |
| GET | `/api/products/<id>` | Get product by ID |
| GET | `/api/products/compare?ids=name1,name2` | Compare products by name |

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
- [ ] Multi-language support

---

## 📄 License
This project is for educational and portfolio purposes.

---

Built with ❤️ by **Kush Chhunchha**
