const express = require("express");
const database = require("./config/database");
const routes = require("./routes/clients/index-routes");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

database.connect();

app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
