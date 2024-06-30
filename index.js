const express = require("express");
const database = require("./config/database");
const routes = require("./routes/clients/index-routes");
const routeAdmin = require("./routes/admin/index.route");
const app = express();
require("dotenv").config();
const port = process.env.PORT;

database.connect();

app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);
routeAdmin(app);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
