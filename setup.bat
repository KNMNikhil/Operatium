@echo off
echo ===================================================
echo             Operatium Setup Script
echo ===================================================

echo [1/4] Checking for Ollama...
ollama -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Ollama is not installed or not running. 
    echo Please install Ollama from https://ollama.com and ensure it is running.
    pause
    exit /b
)

echo [2/4] Pulling qwen2.5:1.5b model (this may take a few minutes)...
ollama pull qwen2.5:1.5b

echo [3/4] Setting up Python Backend...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo [4/4] Setting up Node Frontend...
cd frontend
call npm install
cd ..

echo ===================================================
echo Setup complete! 
echo To run the app, you can either:
echo 1. Run 'docker-compose up' (if you have Docker)
echo 2. Start manually: Run 'npm run dev' in frontend and 'uvicorn app.main:app --reload' in backend
echo ===================================================
pause
