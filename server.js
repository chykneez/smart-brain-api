const express = require('express');
const parser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');

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
  register.handleRegister(req, res, db, bcrypt);
});

app.post('/login', (req, res) => {
  login.handleLogin(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) res.json(user[0]);
      else res.status(400).json('User does not exist!');
    })
    .catch(err => res.status(400).json('User does not exist!'));
});

app.put('/entry', (req, res) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries ')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('Unable to retrieve your entry count.'));
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
