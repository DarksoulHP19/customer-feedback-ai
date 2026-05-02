# 🤖 Customer Feedback AI

An AI agent system to analyze customer reviews, extract key themes, and prioritize product issues — built with **FastAPI** (backend) and **React + Vite + Tailwind CSS** (frontend).

![Pipeline](https://img.shields.io/badge/Pipeline-4%20Agents-00e5ff?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)

---

## 📦 Dataset

Download the Amazon Product Reviews dataset from Kaggle:

👉 [Amazon Product Reviews — Kaggle](https://www.kaggle.com/datasets/arhamrumi/amazon-product-reviews)

After downloading, place and unzip the file in the `data/` folder:

```code
customer-feedback-ai/
└── backend/
    └── data/
        └── Reviews.csv     ← place it here
```

---

## 🧠 How It Works

```code
Customer Feedback (text)
         │
         ▼
┌─────────────────┐
│ Sentiment Agent │ → positive / negative / neutral + confidence %
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Topic Clustering Agent│ → topics + keywords (max 3)
└────────┬─────────────┘
         │
         ▼
┌──────────────────┐
│ Urgency Classifier│ → low / medium / high / critical
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Insight Generator│ → actionable business recommendation
└──────────────────┘
```

---

## 📁 Project Structure

```code
customer-feedback-ai/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── sentiment.py      # Sentiment Analysis Agent
│   │   │   ├── clustering.py     # Topic Clustering Agent
│   │   │   ├── urgency.py        # Urgency Classifier Agent
│   │   │   └── insights.py       # Insight Generator Agent
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic request/response schemas
│   │   ├── utils/
│   │   │   └── llm.py            # OpenAI async wrapper
│   │   └── main.py               # FastAPI app + /analyze endpoint
│   ├── data/
│   │   ├── Reviews.csv           # Amazon dataset (download from Kaggle)
│   │   └── sample_feedback.json  # Sample feedback entries
│   ├── tests/
│   │   └── test_agents.py        # Async pytest test cases
│   ├── conftest.py               # Pytest path + asyncio config
│   ├── pytest.ini                # asyncio_mode = auto
│   ├── .env                      # API keys (gitignored)
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── feedback.js       # Fetch call to FastAPI
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Icon navigation
    │   │   ├── Header.jsx        # Top bar with model badge
    │   │   ├── FeedbackForm.jsx  # Input + source selector
    │   │   ├── ResultPanel.jsx   # 2x2 result cards
    │   │   ├── HistoryPanel.jsx  # Past analyses list
    │   │   └── EmptyState.jsx    # Animated placeholder
    │   ├── App.jsx               # Split dashboard layout
    │   ├── index.css             # Tailwind v4 + custom theme
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js            # Proxy + @tailwindcss/vite
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API key

---

### Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Add your API key
# Edit .env file:
OPENAI_API_KEY=your_openai_api_key_here

# 6. Run the server
fastapi dev .\app\main.py
```

Backend runs at: `http://localhost:8000`  
Swagger UI at: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# 1. Navigate to frontend (new terminal)
cd frontend

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

> **Note:** Vite proxies `/analyze` → `http://localhost:8000` automatically. No CORS issues.

---

## 🧪 Running Tests

```bash
cd backend
pytest .\tests\ -v
```

Tests cover:

- `test_sentiment_analysis` — label + score validation
- `test_topic_clustering` — topic + keyword structure
- `test_urgency_classification` — urgency level check
- `test_insight_generation` — non-empty string output
- `test_full_pipeline` — end-to-end chain

---

## 🌐 API Reference

### `POST /analyze`

**Request:**

```json
{
  "feedback": "Your app crashes on checkout. Very frustrated!",
  "source": "email",
  "customer_id": "C001"
}
```

**Response:**

```json
{
  "feedback": "...",
  "sentiment": {
    "label": "negative",
    "score": 0.95,
    "explanation": "..."
  },
  "topics": [
    {
      "topic": "App Performance",
      "keywords": ["crashing", "checkout", "frustration"]
    }
  ],
  "urgency": {
    "level": "critical",
    "reason": "..."
  },
  "insights": "Immediate action required..."
}
```

### `GET /`

Health check — returns `{ "message": "Customer Feedback AI is running 🚀" }`

---

## 🎨 UI Overview

| Panel | Description |
|---|---|
| **Sidebar** | Icon nav — Dashboard, Analyze, History |
| **Left panel** | Feedback input, source selector, history |
| **Right panel** | 4 result cards — Sentiment, Topics, Urgency, Insights |

---

## 🔌 Switching LLM Providers

All agents call `call_llm()` from `app/utils/llm.py`. To swap providers, only edit that file:

```python
# Current: OpenAI
from openai import AsyncOpenAI

# Switch to Gemini: install google-generativeai and update call_llm()
# Switch to Claude: install anthropic and use AsyncAnthropic client
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| AI | OpenAI GPT-4o-mini, async agents |
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Testing | pytest, pytest-asyncio |
| Dev Tools | python-dotenv, CORS middleware |

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

## 👤 Author

**Harsh** ([@DarksoulHP19](https://github.com/DarksoulHP19))
