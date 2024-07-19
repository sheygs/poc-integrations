const { Queue } = require('bullmq');
const { REDIS_CONNECTOR, REMOVE_CONFIGS } = require('./config');
const setUpWorker = require('./worker');

const jobQueue = new Queue('csvJobs', {
  connection: REDIS_CONNECTOR,
});

// enables us receive updates on the job statuses
jobQueue.setMaxListeners(jobQueue.getMaxListeners() + 100);

setUpWorker();

const appendJobToQueue = (data) => jobQueue.add(data.jobName, data, REMOVE_CONFIGS);

module.exports = {
  jobQueue,
  appendJobToQueue,
};
