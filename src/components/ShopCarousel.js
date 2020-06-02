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
                Slide 1
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
                Subtitle
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam dictum mattis velit.
                </p>
              </div>
              </Fade>
            </div>
          </div>
          <div className="swiper-slide slide-shop2 d-flex justify-content-center align-items-center">
            <div className="d-flex text-center flex-column">
            <Fade top cascade exit={false} delay={500}>
              <div className="title" data-swiper-parallax="-300">
                Slide 2
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
                Subtitle
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam dictum mattis velit.
                </p>
              </div>
              </Fade>
            </div>
          </div>
          <div className="swiper-slide slide-shop3 d-flex justify-content-center align-items-center">
            <div className="d-flex text-center flex-column">
            <Fade top cascade exit={false} delay={500}>
              <div className="title" data-swiper-parallax="-300">
                Slide 3
              </div>
            </Fade>
            <Fade bottom cascade exit={false} delay={1000}>
              <div className="subtitle" data-swiper-parallax="-200">
                Subtitle
              </div>
              </Fade>
            <Fade opposite cascade exit={false} delay={1500}>
              <div className="text" data-swiper-parallax="-100">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Aliquam dictum mattis velit.
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
