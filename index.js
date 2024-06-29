const express = require("express");
require("dotenv").config();
const routes = require("./routes/clients/index-routes");
const app = express();
const port = process.env.PORT;

app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
