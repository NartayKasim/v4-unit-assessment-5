SELECT * FROM helo_users
WHERE lower(username) = lower($1);