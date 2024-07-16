require('dotenv/config');
const express = require('express');
const { join } = require('path');
const { serverAdapter, createBullBoard, BullMQAdapter } = require('./bull-board');
const { appendJobToQueue, jobQueue } = require('./queue');
const { log } = console;

const app = express();

const port = process.env.NODE_PORT ?? 3000;

const csvPath = join(__dirname, '../employment-indicators.csv');

serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [new BullMQAdapter(jobQueue)],
  serverAdapter,
});

app.use(express.json());
app.use('/ui', serverAdapter.getRouter());

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'okay',
  });
});

app.post('/process-csv', async (req, res) => {
  const { employeeName } = req.body;

  const data = {
    jobName: 'csvJobProcesser',
    employeeName,
    csvPath,
  };

  const job = await appendJobToQueue(data);

  return res.status(201).json({ jobId: job?.id });
});

app.listen(port, async () =>
  log(`
          environment: ${process.env.NODE_ENV ?? app.get('env')}
          For the UI, open http://localhost:${port}/ui
          Ensure Redis is running on port 6379 by default
          server running on port ${port}
       `),
);
