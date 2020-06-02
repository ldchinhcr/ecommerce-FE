import React, { useState, useEffect } from "react";
import Swiper from "react-id-swiper";
// import {makeStyles} from "@material-ui/core/styles";

// const useStyles = makeStyles(theme => ({
//   // img: {
//   //   "@media (min-width: 576px)": {
//   //     height: "400px",
//   //   },
//   //   "@media (min-width: 768px)": {
//   //     height: "480px",
//   //   },
//   //   "@media (min-width: 992px)": {
//   //     height: "540px",
//   //   },
//   //   "@media (min-width: 1200px)": {
//   //     height: "600px",
//   //   },
//   //   "@media (min-width: 1500px)": {
//   //     height: "660px",
//   //   },
//   //   "@media (min-width: 1800px)": {
//   //     height: "700px",
//   //   },
//   //   "@media (min-width: 2440px)": {
//   //     height: "800px",
//   //   },
//   // }
// }))

export default function ProductCarousel(props) {
    const [gallerySwiper, getGallerySwiper] = useState(null);
    const [thumbnailSwiper, getThumbnailSwiper] = useState(null);
    const gallerySwiperParams = {
      getSwiper: getGallerySwiper,
      slidesPerView: 1,
      spaceBetween: 10,
      keyboard: true
    };
    
    const thumbnailSwiperParams = {
      getSwiper: getThumbnailSwiper,
      spaceBetween: 10,
      slidesPerView: 'auto',
      touchRatio: 0.2,
      slideToClickedSlide: true,
      centeredSlides: true,
      coverflowEffect: {
        slideShadows: true
      }
    };
    useEffect(() => {
      if (
        gallerySwiper !== null &&
        gallerySwiper.controller &&
        thumbnailSwiper !== null &&
        thumbnailSwiper.controller
      ) {
        gallerySwiper.controller.control = thumbnailSwiper;
        thumbnailSwiper.controller.control = gallerySwiper;
      }
    }, [gallerySwiper, thumbnailSwiper]);

  const htmlImages = props.images.map((i, index) => {
    return (
      <div key={index}>
      <img
       src={i}
       alt="details"
       style={{width: '100%', height: "auto"}}
       key={i}
      /></div>
    );
  });

  const thumbnails = props.images.map((i) => {
    return (
      <img
       src={i}
       alt="details"
       style={{width: '60px', height: 'auto'}}
       key={i}
      />
    );
  });

  return (
    <div className="h-100 mt-3">
    <div>
      <Swiper {...gallerySwiperParams}>{htmlImages}</Swiper>
      <Swiper {...thumbnailSwiperParams}>{thumbnails}</Swiper>
      </div>
    </div>
  );
}
