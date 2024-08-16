const Product = require("../../models/products.model");
const ProductCategory = require("../../models/products-category");
const Accounts = require("../../models/accounts.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");
const systemAdmin = require("../../config/systems");
const treeHelper = require("../../helpers/createTree");

// [GET] /admin/products
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
  //filter

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

  // SORT
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // END SORT

  const products = await Product.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  for (const product of products) {
    const creator = await Accounts.findOne({
      _id: product.createBy.account_id,
    });
    if (creator) {
      product.creator = creator.fullName;
    }
  }

  // console.log(products);

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

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  if (ids.length > 0) {
    if (type == "delete-all") {
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          $set: {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          },
        }
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
        await Product.updateOne(
          { _id: data[0] },
          { position: parseInt(data[1]), $push: { updatedBy: updatedBy } }
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
        { $set: { status: type }, $push: { updatedBy: updatedBy } }
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

// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Xóa sản phẩm thành công !`);
  res.redirect("back");
};

// [GET] /admin/products/restore
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
    .sort({ "deletedBy.deletedAt": -1 })
    .limit(pagination.limit)
    .skip(pagination.skip);

  for (const product of products) {
    const deletor = await Accounts.findOne({
      _id: product.deletedBy.account_id,
    });
    if (deletor) {
      product.deletor = deletor.fullName;
    }
  }

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

// [PATCH] /admin/products/restoreMulti
module.exports.restoreMulti = async (req, res) => {
  const ids = req.body.ids.split(",");
  console.log(ids);

  await Product.updateMany({ _id: { $in: ids } }, { $set: { deleted: false } });
  req.flash("success", `Khôi phục ${ids.length} sản phẩm thành công !`);
  res.redirect("back");
};

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = treeHelper.tree(records);

  const countProducts = await Product.countDocuments();
  res.render("admin/pages/products/create", {
    pageTitle: "Trang thêm Sản phẩm",
    max: countProducts,
    records: newRecords,
  });
};

//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
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

  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  const countProducts = await Product.countDocuments();

  if (req.body.position === "") {
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createBy = {
    account_id: res.locals.user.id,
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemAdmin.prefitAdmin}/products`);
};

//[GET] admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };

    const records = await ProductCategory.find(find);

    const newRecords = treeHelper.tree(records);

    const id = req.params.id;
    const item = await Product.findOne({ _id: id });
    res.render("admin/pages/products/edit", {
      pageTitle: "Trang chỉnh sửa Sản phẩm",
      item: item,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/products`);
  }
};

//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const item = await Product.findOne({ _id: id });

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    console.log(req.body);

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", `Sửa sản phẩm thành công!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/products/detail/${id}`);
  } catch (error) {
    req.flash("error", `Sửa sản phẩm thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/products`);
  }
};

//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Product.findOne({ _id: id });

    // Category title
    let category = {};
    if (item.product_category_id) {
      category = await ProductCategory.findOne({
        _id: item.product_category_id,
      });
    }

    console.log(category);
    // End Category Title

    const newPrice = Math.round(
      item.price * (1 - item.discountPercentage / 100)
    );
    item.newPrice = newPrice;
    // console.log(item);
    res.render("admin/pages/products/detail", {
      pageTitle: item.title,
      item: item,
      category: category.title,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/products`);
    console.log(error);
  }
};

//[GET] admin/products/historyEdit/:id
module.exports.historyEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Product.findOne({ _id: id });

    // Category title
    let category = {};
    if (item.product_category_id) {
      category = await ProductCategory.findOne({
        _id: item.product_category_id,
      });
    }
    //end category

    const newPrice = Math.round(
      item.price * (1 - item.discountPercentage / 100)
    );
    item.newPrice = newPrice;

    // console.log(item);
    const updatedBy = item.updatedBy;
    for (const updateItem of updatedBy) {
      const updater = await Accounts.findOne({ _id: updateItem.account_id });
      updateItem.updater = updater;
    }

    // Log updatedBy để kiểm tra kết quả
    console.log(updatedBy);
    updatedBy.slice(-10);

    res.render("admin/pages/products/historyEdit", {
      pageTitle: item.title,
      item: item,
      category: category.title,
      updatedBy: updatedBy.reverse(),
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/products`);
    console.log(error);
  }
};
