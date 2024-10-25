const mysql2 = require("mysql2");

const createConnection = () => {
  return mysql2.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_USER_PASSWORD || "your-mysql-user-password",
    database: process.env.MYSQL_DATABASE,
  });
};

const actions = {
  async exec(queryString) {
    // Create a connection for each request
    const connection = createConnection();

    return new Promise((resolve, reject) => {
      // Connect to the database
      connection.connect((err) => {
        if (err) {
          console.error("MySQL connection error:", err);
          return reject(err);
        }

        // Execute the query
        connection.query(queryString, (err, results) => {
          // Close the connection after the query is executed
          connection.end();

          if (err) return reject(err);

          resolve(results);
        });
      });
    });
  },

  getFieldsAndData(obj) {
    const fields = Object.keys(obj);
    const fieldsText = fields.join(", ");
    const fieldsData = fields
      .map((field) => {
        if (typeof obj[field] === "string") return `"${obj[field]}"`;
        if (typeof obj[field] === "boolean") return `${obj[field] ? 1 : 0}`;
        return `${obj[field]}`;
      })
      .join(", ");

    return [fieldsText, fieldsData];
  },

  getFieldsAndDataAsKeyPair(obj) {
    const fields = Object.keys(obj);
    const result = fields
      .map((field) => {
        if (typeof obj[field] === "string") return `${field} = "${obj[field]}"`;
        if (typeof obj[field] === "boolean")
          return `${field} = ${obj[field] ? 1 : 0}`;
        return `${field} = ${obj[field]}`;
      })
      .join(", ");
    return result;
  },
};

// Export the actions for use in routes
module.exports = {
  mySQLClientActions: actions,
};
