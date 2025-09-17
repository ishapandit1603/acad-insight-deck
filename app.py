from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
import os
from pathlib import Path

app = FastAPI(title="Acad Insight Deck - FullStack")

# Serve static frontend (dist folder will be copied to frontend_dist)
FRONTEND_DIST = Path(__file__).resolve().parent.parent / "frontend_dist"

if FRONTEND_DIST.exists():
    app.mount("/static", StaticFiles(directory=FRONTEND_DIST / "assets"), name="static")

@app.get("/api/ping")
async def ping():
    return {"message": "pong"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from backend!"}

@app.get("/{full_path:path}")
async def spa(full_path: str):
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return JSONResponse({"detail": "Frontend not built"}, status_code=404)
