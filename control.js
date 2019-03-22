const model = require('./model');

function createNewUser(req, res) {
  model.insertUser(req.body.username, data => {
    res.send({ username: data.name, userId: data.userId });
  });
}

function addExercise(req, res) {
  model.insertExercise(
    {
      userId: req.body.userId,
      description: req.body.description,
      duration: req.body.duration,
      date: req.body.date
    },
    data => {
      res.send(data);
    }
  );
}

function getExercises(req, res) {
  model.selectExercises(req.query, data => {
    res.send(data);
  });
}

function getUsers(req, res) {
  model.selectAllUsers(req.query, data => {
    res.send(data);
  });
}

module.exports = {
  createNewUser,
  addExercise,
  getExercises,
  getUsers
};
