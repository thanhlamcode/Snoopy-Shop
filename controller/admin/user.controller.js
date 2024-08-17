const User = require("../../models/users.model");
const Order = require("../../models/order.model");
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
    find.userInfo.fullName = regex;
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
