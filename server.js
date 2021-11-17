const express = require("express");
const mysql = require("mysql");
const path = require('path')
const nodemailer = require("nodemailer");
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
const server = express();


const publicDirectory = path.join(__dirname, "./public");
server.use(express.static(publicDirectory));

var options = {
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'test',
};

var connection = mysql.createConnection(options);
var sessionStore = new MySQLStore(
  {
    expiration: 10800000,
    createDatabaseTable: true,
    schema: {
      tableName: "sessiontbl",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  connection
);

server.use(
  session({
    key: "shoping.io",
    secret: "shoping@shoping.io",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    },
    msg: ""
  })
);

server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);

// View engine
server.set("view engine", "hbs");

// defining routes
server.use("/", require("./route/req"));
server.use("/auth", require("./route/auth"));

const port = 3000;

server.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`server start at http://localhost:${port}`);
  }
});
