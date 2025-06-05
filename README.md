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

## This is the response in ThunderClient for GET Request on https://loop-ai-2210990373.onrender.com/status/49c525e0-e28e-4779-bdc6-1e0d40233db5
{
  "ingestion_id": "49c525e0-e28e-4779-bdc6-1e0d40233db5",
  "status": "completed",
  "batches": [
    {
      "batch_id": "80af75f7-8eac-4eb5-8856-58524ca95e45",
      "ids": [
        1,
        2,
        3
      ],
      "status": "completed",
      "ingestion_id": "49c525e0-e28e-4779-bdc6-1e0d40233db5"
    },
    {
      "batch_id": "af3b818c-66d0-4f58-9dc9-545fa1c45a13",
      "ids": [
        4,
        5
      ],
      "status": "completed",
      "ingestion_id": "49c525e0-e28e-4779-bdc6-1e0d40233db5"
    }
  ]
}

## This is the response in ThunderClient for POST Request on https://loop-ai-2210990373.onrender.com/ingest/
{
  "ingestion_id": "ae226f90-eb3e-487a-8dad-ee7f467f3937"
}
