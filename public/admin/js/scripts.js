// FILTER PRODUCT

const buttonActive = document.querySelectorAll(".buttonFilter");

buttonActive.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("button_active");
    console.log(value);

    const currentUrl = new URL(window.location.href);

    if (value) {
      currentUrl.searchParams.set("status", value);
    } else {
      currentUrl.searchParams.delete("status");
    }

    window.location.href = currentUrl;
  });
});

// END FILTER PRODUCT

// FORM SEARCH

const formSearch = document.querySelector("#form-search");
console.log(formSearch);
formSearch.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = e.target.elements.keyword.value;
  console.log(keyword);

  const url = new URL(window.location.href);

  if (keyword) {
    url.searchParams.set("keyword", keyword);
  } else {
    url.searchParams.delete("keyword");
  }

  window.location.href = url;
});

// END FORM SEARCH
