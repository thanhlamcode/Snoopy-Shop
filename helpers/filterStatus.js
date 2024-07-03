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
