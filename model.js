const dbFile = './.data/sqlite.db';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(dbFile);
const shortid = require('shortid');

// Create new user and return an id
function insertUser(name, cb) {  
  const userId = shortid.generate();
  db.run(
    'INSERT INTO users (userId, name) VALUES (?, ?)',
    [userId, name],
    err => {
      if (err) throw err;
      cb({ userId, name });
    }
  );
}

// Create exercises w/ userid, description, duration, date
function insertExercise(values, cb) {
  const date = new Date();
  const newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];

  if (!values.date) {
    values.date = newDate;
  }

  db.run(
    'INSERT INTO log (userId, description, duration, date) VALUES (?, ?, ?, ?)',
    [values.userId, values.description, values.duration, values.date],
    err => {
      if (err) throw err;
    }
  ).get(
    'SELECT * FROM leftjoin WHERE userId = ? ORDER BY id DESC',
    values.userId,
    (err, row) => {
      if (err) throw err;
      cb({
        userId: row.userId,
        username: row.name,
        description: row.description,
        duration: row.duration,
        date: row.date
      });
    }
  );
}

// Creates SQL query to select exercise data based on GET query parameters
function selectExercises(query, cb) {
  const sqlAll = 'SELECT * FROM leftjoin WHERE userId = $userId';
  const sqlFrom =
    'SELECT * FROM leftjoin WHERE userId = $userId AND date >= $from';
  const sqlTo = 'SELECT * FROM leftjoin WHERE userId = $userId AND date <= $to';
  const sqlFromTo =
    'SELECT * FROM leftjoin WHERE userId = $userId AND date BETWEEN $from AND $to';
  const sqlLimit = ' LIMIT $limit';

  const values = {};
  let sql = '';

  // Create values obj for db query and choose sql statement
  values.$userId = query.userId;
  if (query.from && query.to) {
    sql = sqlFromTo;
    values.$from = query.from;
    values.$to = query.to;
  } else if (query.from) {
    sql = sqlFrom;
    values.$from = query.from;
  } else if (query.to) {
    sql = sqlTo;
    values.$to = query.to;
  } else {
    sql = sqlAll;
  }

  // Append limit to end of sql if present in query
  if (query.limit) {
    values.$limit = query.limit;
    sql = sql.concat(sqlLimit);
  }

  db.all(sql, values, (err, rows) => {
    if (err) throw err;
    const userEx = {
      _id: rows[0].userId,
      username: rows[0].name,
      count: rows.length,
      log: rows.map(el => {
        return {
          description: el.description,
          duration: el.duration,
          date: el.date
        };
      })
    };
    cb(userEx);
  });
}

// GET All users from users table
function selectAllUsers(query, cb) {
  const sql = 'SELECT * FROM users';
  db.all(sql, (err, rows) => {
    if (err) throw err;
    cb(rows);
  });
}

module.exports = {
  insertUser,
  insertExercise,
  selectExercises,
  selectAllUsers
};

