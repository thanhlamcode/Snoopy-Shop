const express = require("express");
const path = require("path");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
require("dotenv").config();
const moment = require("moment");

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

// tinymce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// END tinymce

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//routes
routes(app);
routeAdmin(app);

app.get("*", (req, res) => {
  res.render("client/pages/error/404", {
    pageTitle: "404 NOT FOUND",
  });
});

// App Local Varialble -  Tạo ra biến toàn cục - file pug nào cũng dùng được
app.locals.prefitAdmin = systemConfig.prefitAdmin;
app.locals.moment = moment;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
