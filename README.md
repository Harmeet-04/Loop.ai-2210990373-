# 🧠 Loop-AI Ingestion API

This is a simple Node.js + Express-based API system to simulate **priority-based asynchronous data ingestion** with **rate-limited batch processing**. It allows clients to submit data ingestion jobs and track their processing status in real time.

---

## 🚀 Live Demo

🌐 API Base URL: [https://loop-ai-2210990373.onrender.com](https://loop-ai-2210990373.onrender.com)

---

## 📦 Features

- Accepts ingestion requests containing IDs and priority
- Processes IDs in **batches of 3** with a **5-second delay between batches**
- Respects request **priority (HIGH > MEDIUM > LOW)** and FIFO within each priority
- Simulates external API calls with mock responses
- Exposes a status endpoint to track job progress
- Async batch processing using Node.js background tasks
- In-memory job queue and state management

---

## 📌 API Endpoints

### 1. `POST /ingest`

Submit an ingestion job.

**Request Body**:
```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"
}
