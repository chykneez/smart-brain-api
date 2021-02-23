const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('This is working!');
});

app.post('/login', (req, res) => {
  res.send('Logging in');
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
