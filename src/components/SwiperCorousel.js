import React from "react";
import PropTypes from "prop-types";
import Skeleton from "@material-ui/lab/Skeleton";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  img: {
    "@media (min-width: 568px)": {
      height: "300px",
    },
    "@media (min-width: 768px)": {
      height: "350px",
    },
    "@media (min-width: 990px)": {
      height: "500px",
    },
    "@media (min-width: 1360px)": {
      height: "550px",
    },
    "@media (min-width: 1920px)": {
      height: "700px",
    },
    "@media (min-width: 2440px)": {
      height: "1000px",
    },
  },
  price: {
    fontStyle: "italic",
    "@media (min-width: 576px)": {
      fontSize: "10px",
    },
    "@media (min-width: 768px)": {
      fontSize: "12px",
    },
    "@media (min-width: 992px)": {
      fontSize: "13px",
    },
    "@media (min-width: 1200px)": {
      fontSize: "14px",
    },
    "@media (min-width: 1500px)": {
      fontSize: "16px",
    },
    "@media (min-width: 1800px)": {
      fontSize: "18px",
    },
    "@media (min-width: 2440px)": {
      fontSize: "20px",
    },
  },
  name: {
    "@media (min-width: 576px)": {
      fontSize: "11px",
    },
    "@media (min-width: 768px)": {
      fontSize: "12px",
    },
    "@media (min-width: 992px)": {
      fontSize: "14px",
    },
    "@media (min-width: 1200px)": {
      fontSize: "16px",
    },
    "@media (min-width: 1500px)": {
      fontSize: "18px",
    },
    "@media (min-width: 1800px)": {
      fontSize: "20px",
    },
    "@media (min-width: 2440px)": {
      fontSize: "22px",
    },
  },
}));

function Media(props) {
  const { loading = false } = props;
  return (
    <div className="d-flex justify-content-center w-100 flex-column  align-items-center">
      <div className="w-100">
        <Skeleton
          style={{ width: "100%", maxHeight: "600px", minHeight: "400px" }}
        />
        <Skeleton className="my-0" variant="rect" />
        <Skeleton width="40%" className="my-0" variant="rect" />
      </div>
    </div>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

export default function SwiperCorousel() {
  const [production, setProduction] = React.useState(null);
  const classes = useStyles();
  const top8RatingProducts = async () => {
    const response = await fetch(
      process.env.REACT_APP_SERVER + "/stats/top8rating"
    );
    const data = await response.json();
    if (data.status === true) {
      setProduction(data.products);
    } else {
      console.log("error");
    }
  };

  React.useEffect(() => {
    if (!production) {
      top8RatingProducts();
    }
  }, []);

  if (!production) {
    return <div>On Loading...</div>;
  }

  let htmlRender;
  if (production.length !== 0 && production[0].list[0].slug) {
    htmlRender = production.map((el) => {
      return (
        <div
          key={el.name}
          className="d-flex flex-column justify-content-center align-items-center pb-4"
        >
          <Link
            to={`/category/${el.type.slug}/products/${el.slug}/${el.list[0].slug}`}
          >
            <div className={`${el.priceDiscount ? "ribbon" : "no-ribbon"}`}>
              {el.priceDiscount ? <span>-{el.priceDiscount}%</span> : null}
              <div
                className={`d-flex flex-column justify-content-center align-items-center ${classes.img}`}
                style={{ width: "100%" }}
              >
                <img
                  src={el.imageCover}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div>
              <Button className={classes.name}>{el.name}</Button>
            </div>
            <div>
              <Button className={classes.price}>{el.price} $</Button>
            </div>
          </Link>
        </div>
      );
    });
  } else {
    htmlRender = <Media loading />;
  }
  return (
    <Carousel
      swipeable={false}
      draggable={false}
      showDots={false}
      responsive={responsive}
      ssr={true}
      infinite={true}
      autoPlay={true}
      centerMode={false}
      autoPlaySpeed={2500}
      minimumTouchDrag={80}
      keyBoardControl={true}
      focusOnSelect
      customTransition="all 0.5s linear"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      {htmlRender}
    </Carousel>
  );
}
