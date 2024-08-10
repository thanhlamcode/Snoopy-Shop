document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".news-slider", {
    effect: "coverflow",
    grabCursor: true,
    loop: true,
    centeredSlides: true,
    keyboard: true,
    spaceBetween: 0,
    slidesPerView: "auto",
    speed: 300,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 3,
      slideShadows: false,
    },
    breakpoints: {
      480: {
        spaceBetween: 0,
        centeredSlides: true,
      },
    },
    simulateTouch: true,
    navigation: {
      nextEl: ".news-slider-next",
      prevEl: ".news-slider-prev",
    },
    pagination: {
      el: ".news-slider__pagination",
      clickable: true,
    },
    on: {
      init: function () {
        var activeItem = document.querySelector(".swiper-slide-active");

        var sliderItem = activeItem.querySelector(".news__item");

        sliderItem.classList.add("active");

        var x = sliderItem.getBoundingClientRect().left;
        var y = sliderItem.getBoundingClientRect().top;
        var width = sliderItem.getBoundingClientRect().width;
        var height = sliderItem.getBoundingClientRect().height;

        document.querySelector(".item-bg").classList.add("active");

        var bg = document.querySelector(".item-bg");
        bg.style.width = width + "px";
        bg.style.height = height + "px";
        bg.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
      },
    },
  });
});

function cLog(content) {
  console.log(content);
}

if (window.innerWidth > 800) {
  document.addEventListener("mouseover", function (event) {
    if (event.target.closest(".news__item")) {
      var newsItems = document.querySelectorAll(".news__item");

      newsItems.forEach(function (element) {
        element.addEventListener("mouseover", function () {
          var rect = element.getBoundingClientRect();
          var x = rect.left;
          var y = rect.top;
          var width = rect.width;
          var height = rect.height;

          document.querySelector(".item-bg").classList.add("active");

          newsItems.forEach(function (el) {
            el.classList.remove("active");
          });

          element.classList.add("active");

          bg.style.width = width + "px";
          bg.style.height = height + "px";
          bg.style.transform =
            "translateX(" + x + "px) translateY(" + y + "px)";
        });

        element.addEventListener("mouseleave", function () {
          document.querySelector(".item-bg").classList.remove("active");
          newsItems.forEach(function (el) {
            el.classList.remove("active");
          });
        });
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var swiper = new Swiper(".news-slider", {
    effect: "coverflow",
    grabCursor: true,
    loop: true,
    centeredSlides: true,
    keyboard: true,
    spaceBetween: 0,
    slidesPerView: "3",
    speed: 300,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 0,
      modifier: 3,
      slideShadows: false,
    },
    breakpoints: {
      480: {
        spaceBetween: 0,
        centeredSlides: true,
      },
    },
    simulateTouch: true,
    navigation: {
      nextEl: ".news-slider-next",
      prevEl: ".news-slider-prev",
    },
    pagination: {
      el: ".news-slider__pagination",
      clickable: true,
    },
    on: {
      init: function () {
        var activeItem = document.querySelector(".swiper-slide-active");

        var sliderItem = activeItem.querySelector(".news__item");

        $(".swiper-slide-active .news__item").addClass("active");

        var x = sliderItem.getBoundingClientRect().left;
        var y = sliderItem.getBoundingClientRect().top;
        var width = sliderItem.getBoundingClientRect().width;
        var height = sliderItem.getBoundingClientRect().height;

        $(".item-bg").addClass("active");

        bg.style.width = width + "px";
        bg.style.height = height + "px";
        bg.style.transform = "translateX(" + x + "px ) translateY(" + y + "px)";
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", function () {
  swiper.on("touchEnd", function () {
    var newsItems = document.querySelectorAll(".news__item");

    // Loại bỏ lớp "active" khỏi tất cả các phần tử ".news__item"
    newsItems.forEach(function (item) {
      item.classList.remove("active");
    });

    // Tìm phần tử ".news__item" trong slide đang hoạt động
    var activeItem = document.querySelector(".swiper-slide-active .news__item");
    if (activeItem) {
      activeItem.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  swiper.on("slideChange", function () {
    $(".news__item").removeClass("active");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  swiper.on("slideChangeTransitionEnd", function () {
    $(".news__item").removeClass("active");
    var activeItem = document.querySelector(".swiper-slide-active");

    var sliderItem = activeItem.querySelector(".news__item");

    $(".swiper-slide-active .news__item").addClass("active");

    var x = sliderItem.getBoundingClientRect().left;
    var y = sliderItem.getBoundingClientRect().top;
    var width = sliderItem.getBoundingClientRect().width;
    var height = sliderItem.getBoundingClientRect().height;

    $(".item-bg").addClass("active");

    bg.style.width = width + "px";
    bg.style.height = height + "px";
    bg.style.transform = "translateX(" + x + "px ) translateY(" + y + "px)";
  });
});
