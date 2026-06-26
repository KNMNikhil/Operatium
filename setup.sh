#!/bin/bash

echo "==================================================="
echo "            Operatium Setup Script"
echo "==================================================="

echo "[1/4] Checking for Ollama..."
if ! command -v ollama &> /dev/null
then
    echo "[ERROR] Ollama could not be found."
    echo "Please install Ollama from https://ollama.com and ensure it is running."
    exit 1
fi

echo "[2/4] Pulling qwen2.5:1.5b model (this may take a few minutes)..."
ollama pull qwen2.5:1.5b

echo "[3/4] Setting up Python Backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
cd ..

echo "[4/4] Setting up Node Frontend..."
cd frontend
npm install
cd ..

echo "==================================================="
echo "Setup complete!"
echo "To run the app, you can either:"
echo "1. Run 'docker-compose up' (if you have Docker)"
echo "2. Start manually: Run 'npm run dev' in frontend and 'uvicorn app.main:app --reload' in backend"
echo "==================================================="
