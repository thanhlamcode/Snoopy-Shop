const User = require("../../models/users.model");
const Order = require("../../models/order.model");
const Products = require("../../models/products.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");

// GET /admin/user
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
    find.fullName = regex;
  }
  //filter

  // PAGINATION
  const totalItem = await User.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 20,
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
    sort.createdAt = "desc";
  }
  // END SORT

  const products = await User.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("admin/pages/user/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/user/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await User.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/user/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  if (ids.length > 0) {
    if (type == "delete-all") {
      await User.updateMany(
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
      req.flash("success", `Xóa thành công ${ids.length} tài khoản !`);
      res.redirect("back");
    } else if (type == undefined) {
      // return;
      res.redirect("back");
    } else {
      await User.updateMany(
        { _id: { $in: ids } },
        { $set: { status: type }, $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái thành công ${ids.length} tài khoản !`
      );
      res.redirect("back");
    }
  }
};

// [PATCH] /admin/user/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await User.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Xóa tài khoản thành công !`);
  res.redirect("back");
};

// [GET] /admin/user/order
module.exports.order = async (req, res) => {
  // filter
  const filter = filterStatus.order(req);

  let find = {
    deleted: false,
  };

  if (req.query.status_payment) {
    find.status_payment = req.query.status_payment;
  }

  console.log(req.query.typeSearch);

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    switch (req.query.typeSearch) {
      case "fullName":
        find["userInfo.fullName"] = regex;
        break;
      case "address":
        find["userInfo.address"] = regex;
        break;
      case "phone":
        find["userInfo.phone"] = regex;
        break;
      default:
        find["userInfo.fullName"] = regex;
        break;
    }
  }

  //filter

  // PAGINATION
  const totalItem = await Order.countDocuments(find);
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

  const products = await Order.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("admin/pages/user/order", {
    pageTitle: "Trang Quản Lý Đơn hàng",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/user/order/change-status/:status/:id
module.exports.changeStatusOrder = async (req, res) => {
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Order.updateOne(
    { _id: id },
    { status_payment: true, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhập trạng thái đơn hàng thành công!");

  res.redirect("back");
};

//[GET] admin/user/order/detail/:id
module.exports.detail = async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findOne({ _id: orderId });

  for (const item of order.products) {
    const product = await Products.findOne({ _id: item.product_id });
    item.thumbnail = product.thumbnail;
    item.title = product.title;

    // Tính tổng tiền từng loại sản phẩm
    const newPrice = Math.round(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    item.newPrice = newPrice;

    const totalPrice = item.newPrice * item.quantity;
    item.totalPrice = totalPrice;
    //end
  }

  order.fullPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  console.log(order);

  res.render("admin/pages/user/detail", {
    pageTitle: "Chi tiết đơn hàng",
    order: order,
  });
};
