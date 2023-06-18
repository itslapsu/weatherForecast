$(document).ready(function () {
  $(".hours").slick({
    swipeToSlide: true,
    arrows: false,
    slidesToShow: 10,
    infinite: false,
    edgeFriction: 0.2,
    accessibility: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 6,
        },
      },
    ],
  });
});
