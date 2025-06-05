const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 5000;

// Priority mapping
const PRIORITY_MAP = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3
};

let ingestionStore = {}; // ingestion_id will take status, batches
let batchQueue = []; // [{ priority, createdAt, batch }]

// Processing loop with async/ await
async function processBatches() {
  while (true) {
    if (batchQueue.length === 0) {
      await delay(1000);
      continue;
    }

    batchQueue.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return a.createdAt - b.createdAt;
    });

    const current = batchQueue.shift();
    const batch = current.batch;

    updateBatchStatus(batch.ingestion_id, batch.batch_id, 'triggered');
    await delay(5000); // Rate limiter

    for (let id of batch.ids) {
      await delay(100); // Simulate external API
    }

    updateBatchStatus(batch.ingestion_id, batch.batch_id, 'completed');
  }
}

function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function updateBatchStatus(ingestion_id, batch_id, status) {
  const ingestion = ingestionStore[ingestion_id];
  if (!ingestion) return;

  for (let batch of ingestion.batches) {
    if (batch.batch_id === batch_id) {
      batch.status = status;
    }
  }

  const statuses = ingestion.batches.map(b => b.status);
  if (statuses.every(s => s === 'yet_to_start')) {
    ingestion.status = 'yet_to_start';
  } else if (statuses.every(s => s === 'completed')) {
    ingestion.status = 'completed';
  } else {
    ingestion.status = 'triggered';
  }
}


//  POST API to ingest data
app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  if (!ids || !priority || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const ingestion_id = uuidv4();
  const batches = [];

  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch = {
      batch_id: uuidv4(),
      ids: batch_ids,
      status: 'yet_to_start',
      ingestion_id
    };
    batches.push(batch);
    batchQueue.push({
      priority: PRIORITY_MAP[priority],
      createdAt: Date.now(),
      batch
    });
  }

  ingestionStore[ingestion_id] = {
    status: 'yet_to_start',
    batches
  };

  res.json({ ingestion_id });
});

//  GET API to get ingestion status
app.get('/status/:ingestion_id', (req, res) => {
  const ingestion = ingestionStore[req.params.ingestion_id];
  if (!ingestion) return res.status(404).json({ error: 'Not found' });
  res.json({ ingestion_id: req.params.ingestion_id, ...ingestion });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  processBatches();
});