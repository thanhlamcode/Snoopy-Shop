const express = require("express");
const app = express();
var methodOverride = require("method-override");
require("dotenv").config();
const database = require("./config/database");
const routes = require("./routes/clients/index-routes");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/systems");
const port = process.env.PORT;

database.connect();
app.use(methodOverride("_method"));
app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);
routeAdmin(app);

// App Local Varialble -  Tạo ra biến toàn cục - file pug nào cũng dùng được
app.locals.prefitAdmin = systemConfig.prefitAdmin;

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
