const express = require('express');
const parser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const login = require('./controllers/login');
const profile = require('./controllers/profile');
const entry = require('./controllers/entry');

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
  res.send('App is working!');
});

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.post('/login', (req, res) => {
  login.handleLogin(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put('/entry', (req, res) => {
  entry.handleEntry(req, res, db);
});

app.post('/imageURL', (req, res) => {
  entry.handleAPICall(req, res);
});

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`Listening on port ${PORT}...`);
});
