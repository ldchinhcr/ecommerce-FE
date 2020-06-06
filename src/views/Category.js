import React, { useEffect, useState } from "react";
import styles from "../utils/landingPage";
import { makeStyles } from "@material-ui/core/styles";
import ShopCarousel from "../components/ShopCarousel";
import Fade from "react-reveal/Fade";
import classNames from "classnames";
import "../fonts/iconic/css/material-design-iconic-font.min.css";
import "../styles/filter.css";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import rally from "../assets/img/color/rally.png";
import { Link } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";
import { useSelector, useDispatch } from "react-redux";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import checkToken from "../components/RefreshToken";

const useStyles = makeStyles(styles);

const customStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    overflow: "hidden",
    boxShadow: "0px 0px 5px 2px #aaaaaa",
  },
  title: {
    fontSize: 14,
  },
  pagination: {
    width: "100%",
    color: "black",
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
  cardAction: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "start",
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
  image: {
    "@media (min-width: 576px)": {
      height: "260px",
    },
    "@media (min-width: 768px)": {
      height: "300px",
    },
    "@media (min-width: 992px)": {
      height: "320px",
    },
    "@media (min-width: 1200px)": {
      height: "380px",
    },
    "@media (min-width: 1500px)": {
      height: "450px",
    },
    "@media (min-width: 1800px)": {
      height: "600px",
    },
    "@media (min-width: 2440px)": {
      height: "650px",
    },
  },
}));

export default function Category() {
  const { type } = useParams();
  const [showProducts, setItem] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const classes = useStyles();
  const customClasses = customStyles();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [currentCart, setCurrentCart] = useState(
    useSelector((state) => state.cart)
  );

  const alertMsgSuccess = {
    title: "Success!",
    text: "Product has been added to your cart successfully!",
    icon: "success",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-check-circle"></i>',
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!",
    text: "Something wrong, try again later!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1000,
  };

  const alertMsgNotLogined = {
    title: "Login!!!",
    text: "You must be logged in first!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const alertMsgNotAllowed = {
    title: "Not Allowed!!!",
    text: "This is your product has post for selling!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const alertMsgOverAvailable = {
    title: "Warning!!!",
    text:
      "You have provide quantity exceeds available products or this product has been unavailable for sale!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const getProducts = async (t, p) => {
    setPage(p);
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER + "/category/" + t + `?page=${p}&&limit=9`
      );
      const data = await response.json();
      if (data.status === true) {
        setTotal(data.totalProducts);
        setItem(data.products);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;

  useEffect(() => {
    if (!showProducts) {
      getProducts(type, page);
    }
  }, [showProducts]);

  const handleChangePage = (event, value) => {
    setPage(value);
    getProducts(type, value);
  };

  const onHandleAddToCart = async (p) => {
    if (!user) {
      Swal.fire(alertMsgNotLogined);
      return;
    }
    const idxByUser = user.listInSelling.findIndex(
      (item) => item.slug === p.list[0].slug && item.product.slug === p.slug
    );
    if (idxByUser === -1) {
      const currentProduct = {
        product: p._id,
        color: p.list[0]._id,
        quantity: 1,
      };
      await sendAddProductToBE(currentProduct);
    } else {
      Swal.fire(alertMsgNotAllowed);
    }
  };

  const sendAddProductToBE = async (data) => {
    await checkToken();
    const response = await fetch(process.env.REACT_APP_SERVER + "/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });
    const responseJson = await response.json();
    if (responseJson.status === true) {
      dispatch({ type: "UPDATE_CART", payload: responseJson.data.products });
      setCurrentCart(responseJson.data.products);
      Swal.fire(alertMsgSuccess);
    } else if (responseJson.message === "Over Availability") {
      Swal.fire(alertMsgOverAvailable);
    }
  };

  if (!showProducts) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ width: "100vw", height: "100vh", background: "lightgray" }}
      >
        <div>
          <RingLoader
            css={override}
            size={150}
            color={"#123abc"}
            loading={true}
          />
        </div>
      </div>
    );
  }

  const listColor = (list) => {
    const icon = list.map((i, index) => {
      return (
        <span key={index}>
          {i.color !== "rally" ? (
            <span
              style={{ backgroundColor: i.color }}
              className="color-icon"
            ></span>
          ) : (
            <span className="color-icon">
              <img src={rally} width="15px" height="15px" />
            </span>
          )}
        </span>
      );
    });
    return icon;
  };

  const productsRender = showProducts.map((el) => {
    if (el.list.length !== 0) {
      return (
        <div key={el.name} className="col-md-4 col-sm-6 col-xs-6 my-2">
          <Card className={customClasses.root}>
            <div
              className={`${
                el.priceDiscount ? "ribbon" : "no-ribbon"
              } image-card`}
            >
              {el.priceDiscount ? <span>-{el.priceDiscount}%</span> : null}
              <Link
                to={`/category/${el.list[0].type.type}/products/${el.slug}/${el.list[0].slug}`}
              >
                <CardContent style={{ zIndex: 1 }}>
                  <Typography
                    className={customClasses.title}
                    component="div"
                    gutterBottom
                  >
                    <img
                      src={el.imageCover}
                      alt="products"
                      className={customClasses.image + " " + "image-product"}
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        width: "100%",
                      }}
                    />
                  </Typography>
                </CardContent>
              </Link>
              <div
                className="add-to-card-cat"
                onClick={() => onHandleAddToCart(el)}
              >
                <AddShoppingCartIcon className="mr-2" /> Add To Cart
              </div>
            </div>
            <CardActions className={customClasses.cardAction}>
              <div className="w-100 text-center justify-content-center">
                {listColor(el.list)}
              </div>
              <Button size="small" className={customClasses.name}>
                {el.name}
              </Button>
              <Button size="small" className={customClasses.price}>
                {el.price} $
              </Button>
            </CardActions>
          </Card>
        </div>
      );
    }
  });

  return (
    <Fade opposite>
      <div className="text-dark" style={{ overflowX: "hidden" }}>
        <ShopCarousel />
        <div className={classNames(classes.main)}>
          <div className={classes.container}>
            <div className="row">{productsRender}</div>

            {Math.ceil(total / 9) !== 0 ? (
              <div className={customClasses.pagination}>
                <Pagination
                  count={Math.ceil(total / 9)}
                  page={page * 1}
                  onChange={handleChangePage}
                  variant="outlined"
                  shape="rounded"
                  size="large"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Fade>
  );
}
