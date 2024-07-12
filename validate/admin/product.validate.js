module.exports.createPost = (req, res, next) => {
  if (!req.body.title) {
    req.flash("error", `Vui lòng thêm tiêu đề sản phẩm!!`);
    res.redirect("back");
    return;
  }

  if (!req.file) {
    req.flash("error", `Vui lòng thêm hình ảnh sản phẩm!!`);
    res.redirect("back");
    return;
  }

  next();
};
