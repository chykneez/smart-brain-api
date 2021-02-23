const express = require('express');
const parser = require('body-parser');

const app = express();
app.use(parser.json());

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
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  )
    res.json('Success');
  else {
    res.status(400).json('Incorrect email or password!');
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
