import React from "react";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import Fade from 'react-reveal/Fade';

export default class ShopCarousel extends React.Component {

  componentDidMount() {
    this.swiper = new Swiper(".swiper-container2", {
      speed: 600,
      parallax: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
      },
    });
  }

  render() {
    return (
      <div className="swiper-container2">
        <div className="parallax-bg" data-swiper-parallax="-23%"></div>
        <div className="swiper-wrapper">
          <div className="swiper-slide slide-shop1 d-flex justify-content-center align-items-center">
            <div className="d-flex text-center flex-column">
            <Fade top cascade exit={false} delay={500}>
              <div className="title" data-swiper-parallax="-300">
                The Chalet Collection
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
              Start strong
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                Featuring bold colors and stripes,
                this luggage is made to inspire winter travel
                </p>
              </div>
              </Fade>
            </div>
          </div>
          <div className="swiper-slide slide-shop2 d-flex justify-content-center align-items-center">
            <div className="d-flex text-center flex-column">
            <Fade top cascade exit={false} delay={500}>
              <div className="title" data-swiper-parallax="-300">
                The Pantone
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
                Styled Fashion
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                As Pantone’s exclusive luggage partner, we drenched our Bigger Carry-On zipper to zipper in their Color of the Year
                </p>
              </div>
              </Fade>
            </div>
          </div>
          <div className="swiper-slide slide-shop3 d-flex justify-content-center align-items-center">
            <div className="d-flex text-center flex-column">
            <Fade top cascade exit={false} delay={500}>
              <div className="title" data-swiper-parallax="-300">
              Bag and gown
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
              Your travel uniform keep you moving
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                Give the grad in your life: a travel uniform of their own
                </p>
              </div>
              </Fade>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
