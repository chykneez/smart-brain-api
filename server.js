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

const app = express();
app.use(parser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  db('users')
    .returning('*')
    .insert({
      name,
      email,
      createdAt: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) =>
      res
        .status(400)
        .json('That email is already taken! Please use another one!')
    );
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

  db.select('*')
    .from('users')
    .where({ id })
    .then((user) => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('User does not exist!');
    })
    .catch((err) => res.status(400).json('User does not exist!'));
});

app.put('/entry', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries ')
    .then((entries) => res.json(entries[0]))
    .catch((err) =>
      res.status(400).json('Unable to retrieve your entry count.')
    );
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
