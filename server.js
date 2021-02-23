const express = require('express');

const app = express();

// Testing
const db = {
  users: [
    {
      id: '1',
      name: 'Patrick',
      email: 'patrick@gmail.com',
      password: 'password',
      entries: 0,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Daniela',
      email: 'daniela@gmail.com',
      password: 'password',
      entries: 0,
      createdAt: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send('This is working!');
});

app.post('/login', (req, res) => {
  res.json('Logging in');
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
