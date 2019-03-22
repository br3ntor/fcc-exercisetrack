CREATE TABLE users (
    id     INTEGER PRIMARY KEY AUTOINCREMENT
                   UNIQUE
                   NOT NULL,
    userId TEXT    UNIQUE
                   NOT NULL,
    name   TEXT    UNIQUE
                   NOT NULL
);

CREATE TABLE log (
    id          INTEGER PRIMARY KEY
                        NOT NULL
                        UNIQUE,
    userId      TEXT    REFERENCES users (userId) ON DELETE CASCADE,
    description TEXT,
    duration    INTEGER,
    date        TEXT
);

CREATE VIEW leftjoin AS
    SELECT log.id,
           users.userId,
           name,
           log.description,
           log.duration,
           log.date
      FROM users
           LEFT JOIN
           log ON users.userId = log.userId;