const express = require("express");
const routes = require("./routes/clients/index-routes");
const app = express();
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
