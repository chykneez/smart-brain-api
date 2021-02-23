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

  const hash = bcrypt.hashSync(password);

  db.transaction(trx => {
    trx
      .insert({
        hash,
        email,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            name,
            email: loginEmail[0],
            createdAt: new Date(),
          })
          .then(user => {
            res.json(user[0]);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(err =>
        res
          .status(400)
          .json('That email is already taken! Please use another one!')
      );
  });
});

app.post('/login', (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('User does not exist!'));
      } else {
        res.status(400).json('Incorrect email or password! Please try again!');
      }
    })
    .catch(err =>
      res.status(400).json('Incorrect email or password! Please try again!')
    );
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
