const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
var cors = require("cors");

require("dotenv").config();
require("./bin/setRetarded");

let api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  cloud: process.env.CLOUD,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY,
  serverURL: process.env.SERVER_URL,
  allowClientClassCreation: process.env.CLIENT_CLASS_CREATION,
  expireInactiveSessions: true,
  sessionLength: process.env.PARSE_SERVER_SESSION_LENGTH,
  fileKey: "optionalFileKey",
});

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const authRoute = require("./routes/auth");
const usersRoute = require("./routes/user");
const itemRoute = require("./routes/item");
const rentRoute = require("./routes/rent");
const staticsRoute = require("./routes/statics");

app.use(express.json());

// Serve the Parse API on the /parse URL prefix
app.use("/parse", api);

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/items", itemRoute);
app.use("/api/rent", rentRoute);
app.use("/api/statics", staticsRoute);

app.listen(PORT, function () {
  console.log("parse-server running on port 1337.");
});
