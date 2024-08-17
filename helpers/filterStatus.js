module.exports = (req) => {
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

  const index = filter.findIndex((item) => item.status === req.query.status);
  if (req.query.status) {
    filter[index].class = "active";
  } else {
    filter[0].class = "active";
  }

  return filter;
};

module.exports.order = (req) => {
  let filter = [
    {
      name: "Tất cả",
      status_payment: "",
      class: "",
    },
    {
      name: "Đã thanh toán",
      status_payment: "true",
      class: "",
    },
    {
      name: "Chưa thanh toán",
      status_payment: "false",
      class: "",
    },
  ];

  const index = filter.findIndex(
    (item) => item.status_payment === req.query.status_payment
  );
  if (req.query.status_payment) {
    filter[index].class = "active";
  } else {
    filter[0].class = "active";
  }

  return filter;
};
