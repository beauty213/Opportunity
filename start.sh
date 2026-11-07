#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "      ScholarEase: AI-Powered Educational Assistance      "
echo "=========================================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "1. Checking Backend Virtual Environment..."
if [ ! -d "$ROOT_DIR/backend/.venv" ]; then
    echo "Creating backend virtualenv..."
    python3 -m venv "$ROOT_DIR/backend/.venv"
    "$ROOT_DIR/backend/.venv/bin/pip" install -r "$ROOT_DIR/backend/requirements.txt"
fi

echo "2. Starting FastAPI Backend on http://localhost:8002..."
cd "$ROOT_DIR/backend"
PYTHONPATH=. "$ROOT_DIR/backend/.venv/bin/python3" run.py &
BACKEND_PID=$!

echo "3. Starting Vite Frontend on http://localhost:5174..."
cd "$ROOT_DIR/frontend"
npm run dev -- --host 0.0.0.0 --port 5174 &
FRONTEND_PID=$!

echo "=========================================================="
echo " ScholarEase is now running!"
echo " • Frontend: http://localhost:5174"
echo " • Backend API & Swagger: http://localhost:8002/docs"
echo " Press Ctrl+C to terminate both servers."
echo "=========================================================="

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true" EXIT

wait
