new Swiper('.main-page__img-wrapper', {
   navigation:{
      nextEl: '.main-page__arrow-next',
      prevEl: '.main-page__arrow-prev'
   },

   loop: true,

   autoplay: {

      delay: 5000,
      stopOnLastSlide: true,
      disableOnInteraction: false
   },
});

new Swiper('.our-work__swiper', {

   loop: true,

   // autoplay: {

   //    delay: 5000,
   //    stopOnLastSlide: true,
   //    disableOnInteraction: false
   // },
});


new Swiper('.product-page__swiper', {
   loop: true,
   thumbs: {
      swiper: {
         el: '.product-page__swiper-mini',
         slidesPerView: 5,
      }
   },
});


