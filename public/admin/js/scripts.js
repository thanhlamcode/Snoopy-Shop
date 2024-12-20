// BACK TO TOP
const btn = document.getElementById("button");

// Thêm sự kiện cuộn cho cửa sổ
window.addEventListener("scroll", function () {
  if (window.scrollY > 300) {
    btn.classList.add("show");
  } else {
    btn.classList.remove("show");
  }
});

// Thêm sự kiện nhấp chuột cho nút
btn.addEventListener("click", function (e) {
  e.preventDefault();
  // Tạo hiệu ứng cuộn mượt mà về đầu trang
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
// END BACK TO TOP

// FILTER PRODUCT

const buttonActive = document.querySelectorAll(".buttonFilter");

buttonActive.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("button_active");
    // console.log(value);

    const currentUrl = new URL(window.location.href);

    if (value) {
      currentUrl.searchParams.set("status", value);
      currentUrl.searchParams.set("page", 1);
    } else {
      currentUrl.searchParams.delete("status");
    }

    window.location.href = currentUrl;
  });
});

// END FILTER PRODUCT

// FILTER ORDER

const buttonActiveOrder = document.querySelectorAll(".buttonFilterOrder");

buttonActiveOrder.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("button_active");
    // console.log(value);

    const currentUrl = new URL(window.location.href);

    if (value) {
      currentUrl.searchParams.set("status_payment", value);
      currentUrl.searchParams.set("page", 1);
    } else {
      currentUrl.searchParams.delete("status_payment");
    }

    window.location.href = currentUrl;
  });
});

// END FILTER ORDER

// FORM SEARCH

const formSearch = document.querySelector("#form-search");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    // console.log(keyword);

    const url = new URL(window.location.href);

    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url;
  });
}

// END FORM SEARCH

// PAGINATION

const buttonPagination = document.querySelectorAll(".button-pagination");
// console.log(buttonPagination);

buttonPagination.forEach((button) => {
  button.addEventListener("click", () => {
    const url = new URL(window.location.href);
    if (button) {
      url.searchParams.set("page", button.innerHTML);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url;
  });
});

//Pre and After

const preBtn = document.querySelector(".previous-button");
const aftBtn = document.querySelector(".after-button");
if (preBtn) {
  preBtn.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const currentPage = parseInt(url.searchParams.get("page"));
    console.log(currentPage);
    if (currentPage > 1) {
      url.searchParams.set("page", currentPage - 1);
      window.location.href = url;
    }
  });
}
if (aftBtn) {
  aftBtn.addEventListener("click", () => {
    const url = new URL(window.location.href);
    const currentPage = parseInt(url.searchParams.get("page"));
    const page = isNaN(currentPage) ? 1 : currentPage;
    console.log(page);
    if (page < buttonPagination.length) {
      url.searchParams.set("page", page + 1);
      window.location.href = url;
    }
  });
}

// END PAGINATION

// SORT
const sort = document.querySelector("[sort-select]");
if (sort) {
  let url = new URL(window.location.href);
  sort.addEventListener("change", () => {
    const value = sort.value;
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url;
  });

  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    const optionSelected = sort.querySelector(`option[value='${stringSort}']`);
    optionSelected.selected = true;
  }
}

const clearSort = document.querySelector("[sort-clear]");
console.log(clearSort);
if (clearSort) {
  clearSort.addEventListener("click", () => {
    let url = new URL(window.location.href);
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url;
  });
}

// END SORT

// TYPE SEARCH
const typeSearch = document.querySelector("select[name='typeSearch']");

if (typeSearch) {
  const formSearchOrder = document.querySelector("#form-search-order");

  if (formSearchOrder) {
    formSearchOrder.addEventListener("submit", (e) => {
      const url = new URL(window.location.href);
      const type = typeSearch.value;
      url.searchParams.set("typeSearch", type);

      e.preventDefault();
      const keyword = e.target.elements.keyword.value;

      if (keyword) {
        url.searchParams.set("keyword", keyword);
      } else {
        url.searchParams.delete("keyword");
      }

      window.location.href = url;
    });

    let url = new URL(window.location.href);
    const value = url.searchParams.get("typeSearch");
    if (value == "") {
      typeSearch.value = "fullName";
    } else {
      typeSearch.value = value;
    }
  }
}
// END TYPE SEARCH
