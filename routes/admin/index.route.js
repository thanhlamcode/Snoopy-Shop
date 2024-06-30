const dashboardRouter = require("./dashboard.route");

module.exports = (app) => {
  app.use("/admin/dashboard", dashboardRouter);
};
