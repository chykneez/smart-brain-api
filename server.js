const express = require('express');
const parser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'pvtrk',
    password: '',
    database: 'smart-brain',
  },
});

db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

const app = express();
app.use(parser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  db('users')
    .insert({
      name,
      email,
      createdAt: new Date(),
    })
    .then(console.log);

  res.json(db.users[db.users.length - 1]);
});

app.post('/login', (req, res) => {
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  )
    res.json(db.users[0]);
  else {
    res.status(400).json('Incorrect email or password!');
  }
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let userExists = false;

  db.users.forEach((user) => {
    if (user.id === id) {
      userExists = true;
      return res.json(user);
    }
  });

  if (userExists) {
    res.status(400).json('User does not exist!');
  }
});

app.put('/entry', (req, res) => {
  const { id } = req.body;
  let userExists = false;

  db.users.forEach((user) => {
    if (user.id === id) {
      userExists = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (userExists) {
    res.status(400).json('User does not exist!');
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
