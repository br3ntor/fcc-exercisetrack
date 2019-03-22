const router = require('express').Router();
const control = require('./control');
const path = require('path');

/* GET home page. */
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './views', 'index.html'));
});

router.post('/api/exercise/new-user', control.createNewUser);
router.post('/api/exercise/add', control.addExercise);
router.get('/api/exercise/log', control.getExercises);
router.get('/api/exercise/users', control.getUsers);

module.exports = router;
