import React, { useEffect, useState } from "react";
import styles from "../utils/landingPage";
import { makeStyles } from "@material-ui/core/styles";
import ShopCarousel from "../components/ShopCarousel";
import Fade from "react-reveal/Fade";
import Pulse from "react-reveal/Pulse";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import classNames from "classnames";
import "../fonts/iconic/css/material-design-iconic-font.min.css";
import "../styles/filter.css";
import { useSelector, useDispatch } from "react-redux";
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
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import checkToken from "../components/RefreshToken";
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const useStyles = makeStyles(styles);

const customStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
    overflow: "hidden",
    boxShadow: "0px 0px 5px 2px #aaaaaa",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column"
  },
  title: {
    fontSize: 14,
    margin: "auto 0"
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

export default function Shop() {
  const [showProducts, setItem] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const classes = useStyles();
  const customClasses = customStyles();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({ name: "" });
  const [total, setTotal] = useState(null);
  const [fixQuery, setFixQuery] = useState("");
  const [filterByCategory, setFilterByCategory] = useState(null);
  const [currentCart, setCurrentCart] = useState(
    useSelector((state) => state.cart)
  );

  const [clickFilter, setClickFilter] = useState(false);
  const [clickSearch, setClickSearch] = useState(false);

  const alertMsgSuccess = {
    title: "Success!",
    text: "Product has been added to your cart successfully!",
    icon: "success",
    iconHtml: '<i class="fad fa-check-circle"></i>',
    showConfirmButton: false,
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!",
    text: "Something wrong, try again later!",
    icon: "error",
    iconHtml: '<i class="fad fa-times"></i>',
    showConfirmButton: false,
    timer: 1500,
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
    text: "You have provide quantity exceeds available products or this product has been unavailable for sale!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const getProducts = async (p) => {
    setPage(p);
    setFilterByCategory("");
    setFixQuery("");
    setQuery({ name: "" });
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER + "/stats/products" + `?page=${p}&&limit=9`
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

  const onChangeSearch = async (e) => {
    e.preventDefault();
    const queryName = { ...query, [e.target.name]: e.target.value };
    setFixQuery("");
    setFilterByCategory("");
    setQuery({ ...query, [e.target.name]: e.target.value });
    if (queryName.name === "") {
      getProducts(1);
      return;
    }
    setPage(1);
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER +
          "/stats/products" +
          `?page=${1}&&limit=9&&name=${queryName.name}`
      );
      const data = await response.json();
      if (data.status === true) {
        setTotal(data.totalProducts);
        setItem(data.products);
      } else {
        console.error("Error to fetch new search results.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const onChangeSearchPage = async (p) => {
    setPage(p);
    setFixQuery("");
    setQuery({ name: "" });
    setFilterByCategory("");
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER +
          "/stats/products" +
          `?page=${p}&&limit=9&&name=${query.name}`
      );
      const data = await response.json();
      if (data.status === true) {
        setTotal(data.totalProducts);
        setItem(data.products);
      } else {
        console.error("Error to fetch new search results.");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const onChangeFilterPrice = async (searchPrice, p) => {
    setPage(p);
    setQuery({ name: "" });
    setFixQuery("priceRange");
    setFilterByCategory("");
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER +
          "/stats/products" +
          `?page=${p}&&limit=9&&${searchPrice}`
      );
      const data = await response.json();
      if (data.status === true) {
        setTotal(data.totalProducts);
        setItem(data.products);
      } else {
        console.error("Error to fetch new search results.");
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
      getProducts(page);
    }
  }, [showProducts]);

  const handleTools = async (string) => {
    if (string === "filter" && clickFilter && !clickSearch) {
      setClickFilter(!clickFilter);
    } else if (string === "filter" && !clickFilter && clickSearch) {
      setClickFilter(!clickFilter);
      setClickSearch(!clickSearch);
    } else if (string === "filter" && !clickFilter && !clickSearch) {
      setClickFilter(!clickFilter);
    } else if (string === "search" && !clickFilter && !clickSearch) {
      setClickSearch(!clickSearch);
    } else if (string === "search" && clickFilter && !clickSearch) {
      setClickSearch(!clickSearch);
      setClickFilter(!clickFilter);
    } else if (string === "search" && !clickFilter && clickSearch) {
      setClickSearch(!clickSearch);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    if (query.name) {
      onChangeSearchPage(value);
    } else if (fixQuery === "priceRange") {
      onChangeFilterPrice(fixQuery, value);
    } else if (fixQuery && fixQuery !== "priceRange") {
      onChangeSort(fixQuery, value);
    } else if (filterByCategory) {
      onSortTypeChanged(filterByCategory, value);
    } else {
      getProducts(value);
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

  const onChangeSort = async (queryString, p) => {
    setPage(p);
    setFixQuery(queryString);
    setFilterByCategory("");
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER +
          "/stats/products" +
          `?page=${p}&&limit=9&&sort=${queryString}`
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

  const onSortTypeChanged = async (t, p) => {
    setPage(p);
    setQuery({ name: "" });
    setFixQuery("");
    setFilterByCategory(t);
    try {
      const response = await fetch(
        process.env.REACT_APP_SERVER + "/category/" + t + `?page=${p}&&limit=9`
      );
      const data = await response.json();
      if (data.status === true) {
        setTotal(data.totalProducts);
        setItem(data.products);
      }
    } catch (err) {}
  };

  const onHandleAddToCart = async (p) => {
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
    } else {
      Swal.fire(alertMsgError);
    }
  };

  const productsRender = showProducts.map((el, index) => {
    if (el.list.length !== 0) {
    return (
      <div key={index} className="col-md-4 col-sm-6 col-xs-6 my-2 d-flex justify-content-between flex-column">
        <Card className={customClasses.root + " flex-fill"}>
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
            <GridContainer>
              <GridItem className="w-100">
                <div className="flex-w flex-sb-m m-tb-10">
                  <div>
                    <button
                      className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 btn-filter"
                      onClick={() => getProducts(1)}
                    >
                      All Products
                    </button>

                    <button
                      className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5  btn-filter"
                      onClick={() => onSortTypeChanged("suitcase", 1)}
                    >
                      Suitcase
                    </button>

                    <button
                      className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 btn-filter"
                      onClick={() => onSortTypeChanged("bag", 1)}
                    >
                      Bag
                    </button>

                    <button
                      className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 btn-filter"
                      onClick={() => onSortTypeChanged("accessories", 1)}
                    >
                      Accessories
                    </button>
                  </div>

                  <div className="d-flex flex-row">
                    <div
                      className={`flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4 ml-4 mr-3 ${
                        clickFilter ? "show-filter" : ""
                      }`}
                      onClick={() => handleTools("filter")}
                    >
                      <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"></i>
                      <i className="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i>
                      <span className="pl-2">Filter</span>
                    </div>

                    <div
                      className={`flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 ml-3 ${
                        clickSearch ? "show-search" : ""
                      }`}
                      onClick={() => handleTools("search")}
                    >
                      <i className="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search"></i>
                      <i className="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i>
                      <span className="pl-2">Search</span>
                    </div>
                  </div>
                </div>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem>
                <Pulse opposite>
                  <div
                    className={`panel-search w-full p-t-10 p-b-15 ${
                      !clickSearch ? "dis-none" : "dis-block"
                    }`}
                  >
                    <div className="bor8 dis-flex p-l-15">
                      <button className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04">
                        <i className="zmdi zmdi-search"></i>
                      </button>

                      <input
                        className="mtext-107 cl2 size-114 plh2 p-r-15 w-100 search-input"
                        type="text"
                        name="name"
                        placeholder="Search"
                        value={query.name}
                        onChange={onChangeSearch}
                      />
                    </div>
                  </div>
                </Pulse>
              </GridItem>
            </GridContainer>

            <GridContainer>
              <GridItem>
                <Pulse opposite>
                  <div
                    className={`panel-filter w-full p-t-10 p-b-15 ${
                      !clickFilter ? "dis-none" : "dis-flex"
                    }`}
                  >
                    <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                      <div className="filter-col1 p-r-15 p-b-27">
                        <div className="mtext-102 cl2 p-b-15">Sort By</div>

                        <ul>
                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => getProducts(1)}
                            >
                              Default
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() =>
                                onChangeSort("-ratingsQuantity", 1)
                              }
                            >
                              Most voted
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => onChangeSort("-priceDiscount", 1)}
                            >
                              Best Discount
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => onChangeSort("-ratingsAverage", 1)}
                            >
                              Average rating
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => onChangeSort("price", 1)}
                            >
                              Price: Low to High
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => onChangeSort("-price", 1)}
                            >
                              Price: High to Low
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                      <div className="filter-col2 p-r-15 p-b-27">
                        <div className="mtext-102 cl2 p-b-15">Price</div>

                        <ul>
                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() => getProducts(1)}
                            >
                              All
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() =>
                                onChangeFilterPrice("price[lte]=250", 1)
                              }
                            >
                              - $250.00
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() =>
                                onChangeFilterPrice(
                                  "price[gt]=250&&price[lte]=350",
                                  1
                                )
                              }
                            >
                              $250.00 - $350.00
                            </span>
                          </li>

                          <li className="p-b-6">
                            <span
                              className="filter-link stext-106 trans-04"
                              onClick={() =>
                                onChangeFilterPrice("price[gte]=350", 1)
                              }
                            >
                              $350.00 +
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Pulse>
              </GridItem>
            </GridContainer>
            <div className="row row-cols-1 row-cols-md-2">{productsRender}</div>
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
