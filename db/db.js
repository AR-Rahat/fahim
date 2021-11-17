const mysql = require("mysql");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
});
db.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected Successfully...");
});
module.exports = db;
