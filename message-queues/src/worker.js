const { Worker } = require('bullmq');
const { join } = require('path');
const { log, error } = console;

const { REDIS_CONNECTOR } = require('./config');

let worker;

const processorPath = join(__dirname, './processor.js');

const setUpWorker = () => {
  worker = new Worker('csvJobs', processorPath, {
    connection: REDIS_CONNECTOR,
    autorun: true,
  });

  worker.on('progress', (job) => {
    // Do something with the return value.
    log(`Job with id ${job.id} in progress`);
  });

  worker.on('completed', (job, returnvalue) => {
    // Do something with the return value.
    log(`Job with id: ${job.id}`, returnvalue);
  });

  worker.on('failed', (_, errObject) => {
    // Do something with the error object.
    error(`Job encountered an error: `, errObject);
  });
};

module.exports = setUpWorker;
