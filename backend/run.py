"""
ScholarStream Backend Runner
Simple script to start the FastAPI development server
Usage: python run.py
"""
import uvicorn
import os
from pathlib import Path
from dotenv import load_dotenv

# Ensure we're in the backend directory
backend_dir = Path(__file__).parent
os.chdir(backend_dir)

# CRITICAL: Load .env file before anything else
env_path = backend_dir / '.env'
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
    print("✅ Environment variables loaded from .env")
else:
    print("⚠️  Warning: .env file not found at", env_path)

if __name__ == "__main__":
    print("🚀 Starting ScholarStream FastAPI Backend...")
    print("📍 Server will run at: http://localhost:8000")
    print("📚 API Docs available at: http://localhost:8000/docs")
    print("🔄 Auto-reload enabled for development")
    print("\n✨ Bismillah ir-Rahman ir-Rahim\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
