const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password)
    return res.status(400).json('Please fill out all of the fields!');

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
};

module.exports = {
  handleRegister,
};
