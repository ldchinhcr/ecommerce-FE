import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Fade from "react-reveal/Fade";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import ProductCarousel from "../components/ProductCarousel";
import styles from "../utils/landingPage";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Icon } from "@material-ui/core";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import classNames from "classnames";
import rally from "../assets/img/color/rally.png";
import Rating from "@material-ui/lab/Rating";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Reviews from "../components/Reviews";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import checkToken from "../components/RefreshToken";


const useStyles = makeStyles(styles);

const customStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    "& > * + *": {
      marginTop: theme.spacing(1),
    },
  },
  textField: {
    margin: theme.spacing(0),
  },
  cartBtn: {
    margin: "30px 20px",
    width: "200px",
  },
  title: {
    fontSize: 14,
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
      fontSize: "11px",
    },
    "@media (min-width: 992px)": {
      fontSize: "12px",
    },
    "@media (min-width: 1200px)": {
      fontSize: "13px",
    },
    "@media (min-width: 1500px)": {
      fontSize: "13px",
    },
    "@media (min-width: 1800px)": {
      fontSize: "14px",
    },
    "@media (min-width: 2440px)": {
      fontSize: "15px",
    },
  },
  name: {
    "@media (min-width: 576px)": {
      fontSize: "10px",
    },
    "@media (min-width: 768px)": {
      fontSize: "11px",
    },
    "@media (min-width: 992px)": {
      fontSize: "11px",
    },
    "@media (min-width: 1200px)": {
      fontSize: "12px",
    },
    "@media (min-width: 1500px)": {
      fontSize: "13px",
    },
    "@media (min-width: 1800px)": {
      fontSize: "14px",
    },
    "@media (min-width: 2440px)": {
      fontSize: "16px",
    },
  },
  image: {
    "@media (min-width: 576px)": {
      height: "250px",
    },
    "@media (min-width: 768px)": {
      height: "250px",
    },
    "@media (min-width: 992px)": {
      height: "270px",
    },
    "@media (min-width: 1200px)": {
      height: "300px",
    },
    "@media (min-width: 1500px)": {
      height: "320px",
    },
    "@media (min-width: 1800px)": {
      height: "360px",
    },
    "@media (min-width: 2440px)": {
      height: "400px",
    },
  },
  cardRoot: {
    minWidth: 275,
    overflow: "hidden",
    boxShadow: "0px 0px 5px 2px #aaaaaa",
  },
}));

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default function ViewProduct() {
  const { type, product, detail } = useParams();
  const [detailProduct, setProduct] = useState(null);
  const [totalReviews, setCount] = useState(null);
  const [colorsSet, setListColors] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const customClasses = customStyles();
  const classes = useStyles();
  const [quantity, setQuantity] = useState(1);
  const [otherProducts, setOtherProducts] = useState(null);
  const [resetValue, setResetValue] = useState(false);
  const [review, setReview] = useState({ rating: null, content: "" });
  const [newArrayCombineItems, setNewArrayCombineItems] = useState(null);
  const [page, setPage] = useState(1);

  const alertMsgSuccess = {
    title: "Success!",
    text: "Product has been added to your cart successfully!",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!",
    text: "Something wrong, try again later!",
    icon: "error",
    showConfirmButton: false,
    timer: 1000,
  };

  const alertMsgNotLogined = {
    title: "Login!!!",
    text: "You must be logged in first!",
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
  };

  const alertMsgNotAllowed = {
    title: "Not Allowed!!!",
    text: "This is your product has post for selling!",
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
  }

  const alertMsgOverAvailable = {
    title: "Warning!!!",
    text: "You have provide quantity exceeds available products or this product has been unavailable for sale!",
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
  }

  const alertMsgLimitQuantity = {
    title: "Not Allowed!!!",
    text: "Product's quantity must be greater than or equal to 1!",
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
  }


  const shuffleRandomItems = () => {
    let combineListItems = otherProducts.filter((el) => el.type !== type);
    combineListItems = [
      ...combineListItems[0].allProducts,
      ...combineListItems[1].allProducts,
    ];
    let listItems = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * combineListItems.length);
      listItems.push(combineListItems[randomIndex]);
      combineListItems.splice(randomIndex, 1);
    }
    setNewArrayCombineItems(listItems);
  };

  const getProduct = async (t, p, c, currentpage) => {
    const response = await fetch(
      process.env.REACT_APP_SERVER +
        "/category/" +
        t +
        "/products/" +
        p +
        "/" +
        c +
        "?page=" +
        currentpage
    );
    const data = await response.json();
    if (data.status === true) {
      setProduct(data.data);
      setCount(data.totalReviews);
    }
  };

  const getOthers = async () => {
    const response = await fetch(process.env.REACT_APP_SERVER + "/category");
    const data = await response.json();
    if (data.status === true) {
      setOtherProducts(data.categories);
    }
  };

  const changeColor = (slug) => {
    if (detail === slug) return;
    history.push(`/category/${type}/products/${product}/${slug}`);
    getProduct(type, product, slug, 1);
    setPage(1);
    setReview({ rating: null, content: "" });
    shuffleRandomItems();
  };

  const getListColors = async (t, p) => {
    const response = await fetch(
      process.env.REACT_APP_SERVER + "/category/" + t + "/products/" + p
    );
    const data = await response.json();
    if (data.status === true) {
      setListColors(data.data);
    }
  };

  const listColor = (obj) => {
    const icon = obj.list.map((i,index) => {
      return (
        <span key={index}>
          {i.color !== "rally" ? (
            <span
              style={{ backgroundColor: i.color, cursor: "pointer" }}
              className="color-icon"
              onClick={() => changeColor(i.slug)}
            ></span>
          ) : (
            <span
              className="color-icon"
              onClick={() => changeColor(i.slug)}
              style={{ cursor: "pointer" }}
            >
              <img src={rally} width="15px" height="15px" />
            </span>
          )}
        </span>
      );
    });
    return icon;
  };

  useEffect(() => {
    getProduct(type, product, detail, page);
  }, [resetValue]);

  useEffect(() => {
    if (!colorsSet) {
      getListColors(type, product);
    }
  }, [colorsSet]);

  useEffect(() => {
    if (!otherProducts) {
      getOthers();
    }
  }, [otherProducts]);

  if (!detailProduct || !colorsSet || !otherProducts) {
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

  if (!newArrayCombineItems) {
    shuffleRandomItems();
  }

  const changeRelateProduct = (t, p, c) => {
    history.push(`/category/${t}/products/${p}/${c}`);
    getProduct(t, p, c, 1);
    setPage(1);
    getListColors(t, p);
    setReview({ rating: null, content: "" });
    shuffleRandomItems();
  };

  const onHandleAddToCart = async (p) => {
    if (!user) {
      Swal.fire(alertMsgNotLogined);
      return;
    }
    if (quantity*1 < 1) {
      Swal.fire(alertMsgLimitQuantity);
      return;
    }
    const idxByUser = user.listInSelling.findIndex(item => item.slug === p.slug && item.product.slug === p.product.slug);
    if (idxByUser === -1) {
    const currentProduct = {
      product: p.product._id,
      color: p._id,
      quantity: quantity*1,
    };
    await sendAddProductToBE(currentProduct);
  } else {
    Swal.fire(alertMsgNotAllowed);
  }
  };

  const onHandleBuyNow = async(p) => {
    if (!user) {
      Swal.fire(alertMsgNotLogined);
      return;
    }
    if (quantity*1 < 1) {
      Swal.fire(alertMsgLimitQuantity);
      return;
    }
    const idxByUser = user.listInSelling.findIndex(item => item.slug === p.slug && item.product.slug === p.product.slug);
    if (idxByUser === -1) {
    const currentProduct = {
      product: p.product._id,
      color: p._id,
      quantity: quantity*1,
    };
    await sendBuyNowToBE(currentProduct);
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
      Swal.fire(alertMsgSuccess);
    } else if (responseJson.message === "Over Availability") {
      Swal.fire(alertMsgOverAvailable);
    } else {
      Swal.fire(alertMsgError);
    }
  };

  const sendBuyNowToBE = async (data) => {
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
      Swal.fire(alertMsgSuccess);
      history.push('/cart');
    } else if (responseJson.message === "Over Availability") {
      Swal.fire(alertMsgOverAvailable);
    } else {
      Swal.fire(alertMsgError);
    }
  };

  const onHandleAddToCartRelatedItems = async (p) => {
    if (!user) {
      Swal.fire(alertMsgNotLogined);
      return;
    }
    const idxByUser = user.listInSelling.findIndex(item => item.slug === p.list[0].slug && item.product.slug === p.slug);
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

  const randomItemHtml =
    newArrayCombineItems && !newArrayCombineItems.includes(undefined)
      ? newArrayCombineItems.map((el) => {
          return (
            <div className="col-md-6 col-xs-6 col-lg-3 mb-3 pb-3" key={el._id}>
              <Card className={customClasses.cardRoot}>
                <div
                  className={`${
                    el.priceDiscount ? "ribbon" : "no-ribbon"
                  } image-card`}
                >
                  {el.priceDiscount ? <span>-{el.priceDiscount}%</span> : null}
                  <CardContent
                    style={{ zIndex: 1 }}
                    onClick={() =>
                      changeRelateProduct(
                        el.list[0].type.type,
                        el.slug,
                        el.list[0].slug
                      )
                    }
                  >
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
                  <div
                    className="add-to-card-cat"
                    onClick={() => onHandleAddToCartRelatedItems(el)}
                  >
                  <AddShoppingCartIcon className="mr-2" />
                    Add To Cart
                  </div>
                </div>
                <CardActions className={customClasses.cardAction}>
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
        })
      : null;

  return (
    <Fade opposite>
      <div className="text-dark pt-5 mt-5" style={{ overflowX: "hidden" }}>
        <div className={classNames(classes.main)}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={5}>
                <ProductCarousel images={detailProduct.images} />
              </GridItem>
              <GridItem xs={12} sm={12} md={7}>
                <div className="d-flex justify-content-start align-items-center h-100">
                  <div className="d-flex justify-content-start text-justify flex-column text-dark px-5">
                    <h2>{detailProduct.product.name}</h2>
                    <p>Price: {detailProduct.product.price}</p>
                    {detailProduct.product.priceDiscount ? (
                      <p>Discount: {detailProduct.product.priceDiscount}%</p>
                    ) : null}
                    <p style={{ fontSize: "20px", color: "gray" }}>
                      Availability: {detailProduct.availability}
                    </p>
                    <div className={customClasses.root}>
                      Rating:{" "}
                      <Rating
                        name="half-rating"
                        value={detailProduct.product.ratingsAverage}
                        precision={0.5}
                        readOnly
                      />
                    </div>
                    Rating Count:{" "}
                    <p style={{ fontSize: "20px", color: "gray" }}>
                      {detailProduct.product.ratingsQuantity}
                    </p>
                    <div className="product-description">
                      <p className="description-content">
                        {detailProduct.description}
                      </p>
                    </div>
                    <div className="d-flex justify-content-start flex-row pl-2">
                      Available Colors: {listColor(colorsSet)}
                    </div>
                    <div className="pt-4">
                      <TextField
                        className={customClasses.textField}
                        variant="outlined"
                        label="Quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        fullWidth
                        inputProps={{
                          min: "1",
                        }}
                      />
                    </div>
                    <div>
                      <Button
                        className={customClasses.cartBtn}
                        variant="outlined"
                        type="button"
                        startIcon={<Icon>add_shopping_cart</Icon>}
                        onClick={() => onHandleAddToCart(detailProduct)}
                      >
                      Add To Cart
                      </Button>
                      <Button
                        className={customClasses.cartBtn}
                        variant="contained"
                        type="button"
                        startIcon={<Icon>payment</Icon>}
                        onClick={() => onHandleBuyNow(detailProduct)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <GridContainer className="d-flex flex-column justify-content-center">
              <h3
                className="py-5 my-3 text-dark text-center"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Recommend Items
              </h3>
              <div className="row">{randomItemHtml}</div>
            </GridContainer>
            <div className="container">
              <Reviews
                page={page}
                params={{ type, product, detail }}
                setPage={setPage}
                product={detailProduct}
                setResetValue={setResetValue}
                getProduct={getProduct}
                countReviews={totalReviews}
                review={review}
                setReview={setReview}
              />
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
