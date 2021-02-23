const express = require('express');
const parser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');

const app = express();
app.use(parser.json());

// Testing
const db = {
  users: [
    {
      id: '1',
      name: 'Patrick',
      email: 'patrick@gmail.com',
      entries: 0,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Daniela',
      email: 'daniela@gmail.com',
      entries: 0,
      createdAt: new Date(),
    },
  ],
  login: [
    {
      id: '1',
      hash: '',
      email: 'patrick@gmail.com',
    },
  ],
};

app.get('/', (req, res) => {
  res.send(db.users);
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });

  db.users.push({
    id: '3',
    name,
    email,
    password,
    entries: 0,
    createdAt: new Date(),
  });

  res.json(db.users[db.users.length - 1]);
});

app.post('/login', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    'password',
    '$2a$10$vOCoNXI1lubq9eBcV3AoieRQqsimhn7JlvgqssqvGpFefoAB0EZAi',
    function (err, res) {
      console.log('first guess', res);
    }
  );
  bcrypt.compare(
    'veggies',
    '$2a$10$vOCoNXI1lubq9eBcV3AoieRQqsimhn7JlvgqssqvGpFefoAB0EZAi',
    function (err, res) {
      console.log('second guess', res);
    }
  );
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  )
    res.json('Success');
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

  if (!userExists) {
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

  if (!userExists) {
    res.status(400).json('User does not exist!');
  }
});

// bcrypt.hash('bacon', null, null, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare('bacon', hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare('veggies', hash, function (err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
