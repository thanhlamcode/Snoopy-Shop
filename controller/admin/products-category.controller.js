const ProductCategory = require("../../models/products-category");
const systemAdmin = require("../../config/systems");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
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
  //filter

  // PAGINATION
  const totalItem = await ProductCategory.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  // SORT
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // END SORT

  const record = await ProductCategory.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh mục sản phẩm",
    record: record,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [GET] /admin/products-category/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Trang thêm mới danh mục sản phẩm",
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const countProducts = await ProductCategory.countDocuments();
  if (req.body.position === "") {
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();
  console.log(req.body);
  res.redirect(`${systemAdmin.prefitAdmin}/products-category`);
};

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  if (ids.length > 0) {
    if (type == "delete-all") {
      await ProductCategory.updateMany(
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
        await ProductCategory.updateOne(
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
      await ProductCategory.updateMany(
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

// [PATCH] /admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // console.log(id);

  // await ProductCategory.deleteOne({ _id: id });
  await ProductCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa sản phẩm thành công !`);
  res.redirect("back");
};

//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await ProductCategory.findOne({ _id: id });
    const newPrice = Math.round(
      item.price * (1 - item.discountPercentage / 100)
    );
    item.newPrice = newPrice;
    console.log(item);
    res.render("admin/pages/products-category/detail", {
      pageTitle: item.title,
      item: item,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/products-category`);
  }
};
