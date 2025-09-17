# --- Build frontend (Node) ---
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/yarn.lock ./
RUN npm ci || npm install
COPY frontend/ .
RUN npm run build

# --- Build python runtime and copy frontend build into it ---
FROM python:3.10-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/dist ./frontend_dist

RUN pip install --upgrade pip
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install -r ./backend/requirements.txt

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
