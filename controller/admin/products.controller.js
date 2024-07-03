const Product = require("../../models/products.model");

// [GET] /admin/products
module.exports.products = async (req, res) => {
  console.log(req.query.keyword);

  let filter = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "unactive",
      class: "",
    },
  ];

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

  const index = filter.findIndex((item) => item.status === req.query.status);
  if (req.query.status) {
    filter[index].class = "active";
  } else {
    filter[0].class = "active";
  }

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
  });
};
