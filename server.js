const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 5000;

app.use(express.json()); // Enable JSON parsing middleware

app.options('/run-python', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200); // Respond to preflight request for CORS
});

app.post('/run-python', (req, res) => {
  const { url } = req.body; // Get the URL from the request body

  const python = spawn('python', ['networkTester.py', url]);

  let result = '';

  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script...');
    result += data.toString();
  });

  python.on('close', (code) => {
    console.log(`Child process close all stdio with code ${code}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.json({ result }); // Send the result as JSON
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});