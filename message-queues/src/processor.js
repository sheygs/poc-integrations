const { promisify } = require('util');
const { existsSync, unlinkSync, createReadStream, writeFileSync } = require('fs');
const { parse } = require('csv-parse');
const { log } = console;

const wait = promisify(setTimeout);

const fileName = 'employment-indicators.json';

if (existsSync(fileName)) {
  unlinkSync(fileName);
}

const jobProcessor = async (job) => {
  log(`Processing job ${job.id} execution started: `);

  // CPU intense logic
  await extractJobData(job?.data);

  await job.updateProgress(100);

  return 'COMPLETED';
};

const extractJobData = async (jobData) => {
  let results = [];

  try {
    await wait(3000);

    createReadStream(jobData?.csvPath)
      .pipe(
        parse({
          columns: true,
        }),
      )
      .on('data', (data) => {
        // log({ data });
        results.push(data);
      })
      .on('error', (error) => {
        log({ error });
      })
      .on('end', () => {
        // manipulation logic

        results = results.reduce((acc, item) => {
          const key = item.Week_end;

          acc[key] = acc[key] || [];
          acc[key].push(item);

          return acc;
        }, {});

        const data = { [jobData.employeeName]: results };
        writeFileSync(fileName, JSON.stringify(data, null, 2));
      });
  } catch ({ message }) {
    log(`Error: ${message}`);
  }
};

module.exports = jobProcessor;
