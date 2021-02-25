const Clarifai = require('clarifai');

const app = new Clarifai.App({ apiKey: '39f6a75609484f5da7c5bc7860d4ae48' });

const handleAPICall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err =>
      res.status(400).json('Unable to make API call. Please try again!')
    );
};

const handleEntry = (req, res, db) => {
  const { id } = req.body;

  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries ')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('Unable to retrieve your entry count.'));
};

module.exports = {
  handleEntry,
  handleAPICall,
};
