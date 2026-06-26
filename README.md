# Operatium: AI Executive Board Simulator

![Operatium Overview](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Ollama](https://img.shields.io/badge/Ollama-Local_Inference-orange.svg)

Operatium is a **Local-First, AI-driven Executive Board Simulator**. It leverages multiple autonomous AI agents—acting as CEO, CTO, Product Manager, Growth Lead, and Risk Advisor—to debate, analyze, and validate startup ideas or business strategies in real-time.

By running locally via **Ollama**, Operatium ensures that your proprietary business data remains 100% private, while utilizing a powerful Retrieval-Augmented Generation (RAG) system to ground the AI's logic in real-world startup frameworks.

---

## 🏗️ AI & System Architecture

Operatium is designed to be robust and flexible, with fallback mechanisms built into the core agent graph.

### 1. Main LLM Engine: Local Qwen 3.5
- **Model:** `qwen3.5` (via Ollama)
- **Role:** Primary inference engine for all executives. 
- **Why Qwen 3.5:** Highly capable at reasoning, instruction following, and maintaining complex persona instructions while being small enough to run locally.

### 2. Fallback Engine: OpenRouter
- **Model:** Configurable (defaults to `huggingfaceh4/zephyr-7b-beta` or `gpt-oss-120b:free`)
- **Role:** If the local Ollama server crashes, times out, or is turned off, the LangGraph orchestrator automatically routes the execution request to a cloud-based LLM via OpenRouter.

### 3. Knowledge Base (RAG) & Embeddings
- **Embedding Model:** Google `gemini-embedding-001` (requires API key).
- **Vector Database:** Supabase PostgreSQL with the `pgvector` extension.
- **Usage:** Ingests PDFs, articles, and frameworks (e.g., Y Combinator advice) so that executives base their decisions on established industry knowledge.

---

## 💻 Hardware Requirements

Because Operatium runs local AI models, hardware plays a significant role in generation speed.

| Component | Minimum (CPU Only) | Recommended (GPU / Apple Silicon) |
|-----------|---------------------|-----------------------------------|
| **RAM** | 8 GB | 16 GB+ |
| **GPU VRAM** | N/A | 6 GB+ (Nvidia RTX or Apple M-series Unified Memory) |
| **Storage** | 10 GB Free Space (Model weights) | 10 GB Free Space (SSD highly recommended) |
| **Performance**| ~2-5 tokens per second | ~20-50+ tokens per second (Real-time) |

*Note: If you lack the hardware to run the model locally, you can easily switch the main engine to use OpenAI, Anthropic, or OpenRouter by configuring the `.env` file.*

---

## 🚀 Detailed Installation Guide

### Step 1: Install System Prerequisites
Ensure you have the following installed on your machine:
1. **[Node.js (v18+)](https://nodejs.org/)** - For the React frontend.
2. **[Python (v3.10+)](https://www.python.org/)** - For the FastAPI backend.
3. **[Ollama](https://ollama.com/)** - To run the local models.
4. **Git** - To clone the repository.

### Step 2: Set up Ollama (Local AI)
Once Ollama is installed on your system, open your terminal and pull the main model:
```bash
ollama pull qwen3.5
```
*Note: This download is approximately 4.5GB - 6.6GB depending on the quantization.*

### Step 3: Set up the Supabase Database
Operatium relies on Supabase for data persistence and `pgvector` for RAG memory.
1. Go to [Supabase](https://supabase.com/) and create a free project.
2. Navigate to the **SQL Editor** in your Supabase dashboard.
3. Copy the entire contents of the `backend/schema.sql` file from this repository and run it. This will create all necessary tables and security policies.
4. Navigate to **Project Settings -> API** and copy your `Project URL` and `anon public key`.

### Step 4: Configure the Backend
Open a new terminal and navigate to the backend folder:
```bash
cd backend
```

**Create and activate a virtual environment:**
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

**Install Python dependencies:**
```bash
pip install -r requirements.txt
```

**Configure Environment Variables:**
Create a file named `.env` in the `backend/` directory and add the following keys:
```env
# Required: Supabase Database
SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Required: For RAG Embeddings
GOOGLE_API_KEY="your-google-gemini-api-key"

# Optional: Fallback Cloud LLM (If Ollama is offline)
OPENROUTER_API_KEY="your-openrouter-key" 
```

**Run the Backend Server:**
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*The backend should now be running at `http://127.0.0.1:8000`.*

### Step 5: Configure the Frontend
Open a new terminal window and navigate to the frontend folder:
```bash
cd frontend
```

**Install Node dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_URL="http://127.0.0.1:8000"
```

**Run the Frontend Development Server:**
```bash
npm run dev
```

Visit the local URL provided by Vite (usually `http://localhost:5173`) in your browser. You are now ready to pitch your first startup to the AI Executive Board!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is open-sourced under the MIT License.
