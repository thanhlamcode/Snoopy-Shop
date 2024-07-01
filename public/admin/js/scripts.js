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
