# 🤖 Customer Feedback AI

An AI agent system to analyze customer reviews, extract key themes, and prioritize product issues — built with **FastAPI** (backend) and **React + Vite + Tailwind CSS** (frontend).

![Version](https://img.shields.io/badge/Version-2.0.0-00e5ff?style=flat-square)
![Pipeline](https://img.shields.io/badge/Pipeline-4%20Agents-00e5ff?style=flat-square)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=flat-square&logo=tailwindcss)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🖼️ Preview

* Dashboard

![Dashboard Preview](/images/Dashboard.png)

![Light mode](/images/Lightmode.png)

* Responsive design

![Responsive Design](/images/Responsive.png)

---

* Feedback analysis results

![Feedback Analysis](/images/Feedback.png)

---

## 📦 Dataset

Download the Amazon Product Reviews dataset from Kaggle:

👉 [Amazon Product Reviews — Kaggle](https://www.kaggle.com/datasets/arhamrumi/amazon-product-reviews)

After downloading, place and unzip the file in the `data/` folder:

```CODE
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
│ Sentiment Agent │ → positive / negative / neutral / uncertain + confidence %
└────────┬────────┘
         │
         ▼
┌───────────────────────┐
│ Topic Clustering Agent│ → topics + keywords (max 3)
└────────┬──────────────┘
         │
         ▼
┌───────────────────┐
│ Urgency Classifier│ → low / medium / high / critical
└────────┬──────────┘
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
│   │   │   └── schemas.py        # Pydantic schemas + batch models
│   │   ├── utils/
│   │   │   ├── llm.py            # OpenAI async wrapper
│   │   │   └── cache.py          # In-memory LRU cache
│   │   └── main.py               # FastAPI app + all endpoints
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
    │   │   └── feedback.js         # Fetch call to FastAPI
    │   ├── components/
    │   │   ├── Sidebar.jsx          # Icon navigation
    │   │   ├── Header.jsx           # Top bar + export + theme toggle
    │   │   ├── FeedbackForm.jsx     # Input + char limit + source selector
    │   │   ├── ResultPanel.jsx      # 2x2 result cards + confidence badge
    │   │   ├── HistoryPanel.jsx     # Past analyses list
    │   │   ├── EmptyState.jsx       # Animated placeholder
    │   │   ├── ExportButton.jsx     # JSON / CSV export dropdown
    │   │   └── ThemeToggle.jsx      # Dark / Light mode toggle
    │   ├── context/
    │   │   └── ThemeContext.jsx     # Global theme state + localStorage
    │   ├── utils/
    │   │   └── export.js            # Export logic (JSON + CSV)
    │   ├── App.jsx                  # Split dashboard layout
    │   ├── index.css                # Tailwind v4 + dark/light CSS vars
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js               # Proxy + @tailwindcss/vite
    └── package.json
```

---

## ✨ Features

### Backend

| Feature | Description |
| --- | --- |
| 4-Agent Pipeline | Sentiment → Topics → Urgency → Insights chained agents |
| Rate Limiting | 10 req/min per IP on `/analyze`, 3/min on `/analyze/batch` |
| Trace ID | Unique ID per request for end-to-end log correlation |
| Confidence Guard | Score < 0.4 → returns `uncertain` instead of wrong label |
| Startup Validation | Server fails fast if `OPENAI_API_KEY` is missing |
| Batch Endpoint | `POST /analyze/batch` — up to 20 feedbacks concurrently |
| LRU Cache | Same feedback → cached result, no extra OpenAI API call |
| Health Endpoint | `GET /health` — status, uptime, model, cache stats |

### Frontend

| Feature | Description |
| --- | --- |
| Split Dashboard | Sidebar + left input panel + right results panel |
| Confidence Badge | `HIGH / MED / LOW CONFIDENCE` tag on sentiment card |
| Export History | Download full analysis history as JSON or CSV |
| Dark / Light Mode | Toggle with localStorage persistence |
| Character Limit | Warn if feedback < 20 or > 2000 characters |
| Copy to Clipboard | Copy insights text with one click |
| Cached Indicator | `⚡ CACHED` badge when result served from cache |
| Responsive Design | Works on mobile, tablet, and desktop |

---

## 🚀 Getting Started

### Prerequisites

* Python 3.11+
* Node.js 18+
* OpenAI API key

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

* `test_sentiment_analysis` — label + score validation
* `test_sentiment_uncertain_fallback` — confidence guard check
* `test_topic_clustering` — topic + keyword structure
* `test_urgency_classification` — urgency level check
* `test_insight_generation` — non-empty string output
* `test_full_pipeline` — end-to-end chain
* `test_analyze_endpoint_returns_trace_id` — trace ID on response
* `test_health_endpoint` — uptime + status check
* `test_empty_feedback_rejected` — 422 on empty input

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
  "trace_id": "a1b2c3d4",
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
  "insights": "Immediate action required...",
  "cached": false
}
```

---

### `POST /analyze/batch`

```json
{
  "feedbacks": ["text1", "text2", "text3"],
  "source": "csv"
}
```

Max 20 feedbacks per request. Runs concurrently. Cached entries return instantly.

---

### `GET /health`

```json
{
  "status": "ok",
  "version": "2.1.0",
  "model": "gpt-4o-mini",
  "uptime_seconds": 3600,
  "cache": {
    "size": 12,
    "hits": 34,
    "misses": 10,
    "hit_rate_pct": 77.3
  }
}
```

### `GET /cache/stats`

Returns cache performance metrics — size, hits, misses, hit rate %.

### `GET /`

Health check — returns `{ "message": "Customer Feedback AI is running 🚀" }`

---

## 🎨 UI Overview

| Panel | Description |
| --- | --- |
| **Sidebar** | Icon nav — Dashboard, Analyze, History |
| **Left panel** | Feedback input, char limit, source selector, history |
| **Right panel** | 4 result cards — Sentiment, Topics, Urgency, Insights |
| **Header** | Export button, theme toggle, model badge, analyzed count |

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
| --- | --- |
| Backend | FastAPI, Uvicorn, Pydantic v2, slowapi |
| AI | OpenAI GPT-4o-mini, async multi-agent pipeline |
| Caching | In-memory LRU cache (200 entries) |
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Testing | pytest, pytest-asyncio, httpx |
| Dev Tools | python-dotenv, CORS middleware |

---

## 📄 License

[MIT License](LICENSE) — feel free to use, modify, and distribute.

---

## 👤 Author

**Harsh** ([@DarksoulHP19](https://github.com/DarksoulHP19))
