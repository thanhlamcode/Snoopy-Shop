const Product = require("../../models/products.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");

// [GET /admin/products]
module.exports.products = async (req, res) => {
  // filter
  const filter = filterStatus(req);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  // PAGINATION
  const totalItem = await Product.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(pagination.limit)
    .skip(pagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  if (ids.length > 0) {
    if (type == "delete-all") {
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { deleted: true } }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm !`);
      res.redirect("back");
    } else if (type == undefined) {
      // return;
      res.redirect("back");
    } else if (type == "change-position") {
      // res.send("ok");
      ids.forEach(async (item, index) => {
        item = ids[index].split(",");
        const data = item[0].split("-");
        // console.log(data[1]);
        await Product.updateOne(
          { _id: data[0] },
          { position: parseInt(data[1]) }
        );
      });
      req.flash(
        "success",
        `Thay đổi vị trí thành công ${ids.length} sản phẩm !`
      );
      res.redirect("back");
    } else {
      await Product.updateMany(
        { _id: { $in: ids } },
        { $set: { status: type } }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái thành công ${ids.length} sản phẩm !`
      );
      res.redirect("back");
    }
  } else {
  }
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // console.log(id);

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa sản phẩm thành công !`);
  res.redirect("back");
};

// [GET /admin/products/restore]
module.exports.restore = async (req, res) => {
  // filter
  const filter = filterStatus(req);

  let find = {
    deleted: true,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }

  // PAGINATION
  const totalItem = await Product.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  const products = await Product.find(find)
    .sort({ deletedAt: "desc" })
    .limit(pagination.limit)
    .skip(pagination.skip);
  res.render("admin/pages/products/productsRestore", {
    pageTitle: "Trang Khôi phục sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/products/restore/:id
module.exports.restoreProducts = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { deleted: false });
  req.flash("success", `Khôi phục sản phẩm thành công !`);
  res.redirect("back");
};

module.exports.restoreMulti = async (req, res) => {
  // const type = req.body.type;
  const ids = req.body.ids.split(",");
  console.log(ids);
  // res.send("ok");

  await Product.updateMany({ _id: { $in: ids } }, { $set: { deleted: false } });
  req.flash("success", `Khôi phục ${ids.length} sản phẩm thành công !`);
  res.redirect("back");
};
