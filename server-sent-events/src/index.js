const express = require('express');
const { join } = require('path');
const SSE = require('express-sse');

const app = express();
const sse = new SSE();

const publicDirPath = join(__dirname, '../public');

app.use(express.static(publicDirPath));

app.get('/stream', (req, res) => {
  sse.init(req, res);
});

// we can always call sse.send from anywhere the sse variable is available, and see the result in our stream.

app.post('/send', (req, res) => {
  const message = req.query.message || 'Default message';
  sse.send(message);
  res.status(200).send('Message sent');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
