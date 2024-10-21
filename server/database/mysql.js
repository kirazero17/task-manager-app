const mysql2 = require("mysql2");

const connection = mysql2.createConnection(
  {
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_USER_PASSWORD || "your-mysql-user-password",
    database: "TODOAPP",
  },
  function (err) {
    console.log(err);
  }
);

const actions = {
  async exec(queryString) {
    const result = new Promise((resolve, reject) => {
      connection.query(queryString, function (err, results) {
        if (err) reject(err);

        resolve(results);
      });
    });

    return result;
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

// Export the connection or use it in your routes
module.exports = {
  mySQLClient: connection,
  mySQLCLientActions: actions,
};
