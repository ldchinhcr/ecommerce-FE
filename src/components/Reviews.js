import React, {useState} from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { useSelector } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import Pagination from "@material-ui/lab/Pagination";
import { TextField } from "@material-ui/core";
import { Smile } from "react-feather";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker, NimbleEmojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { getByNative } from "../utils/regexCheckEmoji";
import { EmojiReg } from "../utils/EmojsRegex";
import anonymous from "../assets/img/anonymous.png";
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const moment = require("moment");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
  pagination: {
    width: "100%",
    color: "black",
    "& > *": {
      marginTop: theme.spacing(2),
    },
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "95%",
  },
  emojiBtn: {
    width: "5%",
  }
}));

export default function Reviews(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const limitShow = 5;
  const user = useSelector((state) => state.user);
  let [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const alertMsgSuccess = {
    title: "Success!",
    text: "Review has been created successfully!",
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

  const alertMsgContent = {
    title: "Empty Content!!!",
    text: "Please provide rating star and input content!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  function addEmoji(emoji) {
    const text = `${props.review.content}${emoji.native}`;
    props.setReview({...props.review, content: text});
    setShowEmojiPicker(false);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  }

  function toggleEmojiPicker() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  const handleChangeInput = (e) => {
    if (e.target.name === "rating") {
      props.setReview({ ...props.review, [e.target.name]: e.target.value * 1 });
    } else {
      const emoji = getByNative(e.target.value);
      if (emoji) {
        props.setReview({ ...props.review, [e.target.name]: emoji.native });
      } else {
        props.setReview({ ...props.review, [e.target.name]: e.target.value });
      }
    }
  };

  const handleSubmit = async() => {
    if (!props.review.rating || !props.review.content) {
      Swal.fire(alertMsgContent);
      return;
    }
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(props.review)
    }
    const response = await fetch(process.env.REACT_APP_SERVER + '/category/' + props.product.type.slug + '/products/' + props.product.product.slug + '/reviews', options);
    const data = await response.json();
    if (data.status === true) {
      Swal.fire(alertMsgSuccess);
      props.getProduct(props.product.type.slug, props.product.product.slug, props.product.slug, props.page);
      props.setReview({rating: null, content: ""});
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    } else {
      Swal.fire(alertMsgError);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleChangePage = (event, value) => {
    props.setPage(value);
    props.getProduct(props.params.type, props.params.product, props.params.detail, value);
  };

  let renderReviews;
  if (props.product.allReview.length !== 0) {
    renderReviews = props.product.allReview
      .map((el) => {
        return (
          <div key={el._id} className="text-dark row render-reviews my-5 mx-2">
            <div className="col-2" style={{ borderRight: "1px solid gray" }}>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="mb-2">{el.createdBy.name}</div>
                <div>
                  <img
                    src={el.createdBy.avatar ? el.createdBy.avatar : anonymous}
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                    alt={el.createdBy.name}
                  />
                </div>
              </div>
            </div>
            <div className="col-10">
              <div>
                <div className="d-flex justify-content-between align-items-center">
                  <Rating
                    name="disabled"
                    value={el.rating}
                    disabled
                    precision={0.5}
                  />{" "}
                  {moment(el.createdAt).format("hh:mm A - MM/DD/YY")}
                </div>
                <div>{EmojiReg(el.content)}</div>
              </div>
            </div>
          </div>
        );
      });
  } else {
    renderReviews = (
      <div className="text-dark row render-reviews my-5 mx-2">
        This product currently has no reviews yet.
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Reviews" {...a11yProps(0)} />
          <Tab
            label="Create Review"
            {...a11yProps(1)}
            disabled={!user ? true : false}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{overflowX: "visible"}}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          {renderReviews}
          {Math.ceil(props.countReviews / limitShow) !== 0 ? (
            <div className={classes.pagination}>
              <Pagination
                count={Math.ceil(props.countReviews / limitShow)}
                page={props.page}
                onChange={handleChangePage}
              />
            </div>
          ) : null}
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
        {showEmojiPicker ? (
          <NimblePicker
            set="facebook"
            title="Pick an icon"
            data={data}
            onSelect={addEmoji}
          />
        ) : null}
        <form onChange={handleChangeInput}>
            <div className="text-dark d-flex flex-row justify-content-start align-items-center my-3">
            <span>Choose Rating: </span>
            <Rating
                name="rating"
                value={props.review && props.review.rating}
                precision={0.5}
                disabled={!user ? true : false}
              />
              {props.review && props.review.rating ? <span className="pl-5">Your voted for this product {props.review.rating} star(s)</span> : null}
            </div>
            <div className="d-flex flex-row justify-content-around">
            <button
              type="button"
              className={`toggle-emoji ${classes.emojiBtn}`}
              onClick={toggleEmojiPicker}
              disabled={!user ? true : false}
            >
              <Smile />
            </button>
              <TextField
                name="content"
                variant="outlined"
                placeholder="Input review content then hit ENTER"
                label="Review Content"
                type="text"
                id="standard-required"
                className={classes.textField}
                value={props.review.content}
                required
                disabled={!user ? true : false}
                onKeyPress={handleKeyPress}
              />
              </div>
          </form>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
