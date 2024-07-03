module.exports = (pagination, req, totalItem) => {
  let page = req.query.page;
  if (page) {
    pagination.currentPage = parseInt(page);
  }
  const skip = Math.ceil((pagination.currentPage - 1) * pagination.limit);
  pagination.skip = skip;
  const totalPage = Math.ceil(totalItem / pagination.limit);
  pagination.totalPage = totalPage;

  return pagination;
};
