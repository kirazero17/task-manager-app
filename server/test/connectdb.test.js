const mysql2 = require("mysql2");

const connection = mysql2.createConnection({
  host: process.env.MYSQL_CONTAINER,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_USER_PASSWORD,
  database: "TODOAPP",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

// Export the connection or use it in your routes
module.exports = connection;
