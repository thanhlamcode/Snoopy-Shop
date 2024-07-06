const express = require("express");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("dotenv").config();

const database = require("./config/database");
const routes = require("./routes/clients/index-routes");
const routeAdmin = require("./routes/admin/index.route");
const systemConfig = require("./config/systems");
const port = process.env.PORT;

database.connect();

// FLASH
app.use(cookieParser("keyboard cat"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// END FLASH

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

//routes
routes(app);
routeAdmin(app);

// App Local Varialble -  Tạo ra biến toàn cục - file pug nào cũng dùng được
app.locals.prefitAdmin = systemConfig.prefitAdmin;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
