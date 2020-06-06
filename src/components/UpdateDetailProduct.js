import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Icon, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import configS3 from "../utils/AWSS3";
import S3 from "react-aws-s3";
import checkToken from "./RefreshToken";
import { Modal } from "react-bootstrap";
import ChromePicker from "react-color";
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";
import { CircularProgress } from "@material-ui/core";
import rally from "../assets/img/color/rally.png";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    display: "block",
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(0),
    width: "100%",
  },
  input: {
    display: "block",
  },
  avatarBtn: {
    margin: "0",
  },
}));

export default function UpdateDetailProduct(props) {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const [images, setImages] = useState(null);
  const [onload, setOnload] = useState(false);
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const S3Uploader = new S3(configS3);
  const dispatch = useDispatch();

  const onChangeDetailsSubmit = (e) => {
    if (e.target.name !== "images") {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  };

  const alertMsgSuccess = {
    title: "Success!!!",
    text: "Your product has been updated successfully!",
    icon: "success",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-check-circle"></i>',
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!!!",
    text: "Your must provide some information to update!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1500,
  };

  const alertMsgFetchError = {
    title: "Error!!!",
    text: "Something went wrong while update your product!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const alertMsgNotAuthorized = {
    title: "Error!!!",
    text: "This product is not belong to your to modify!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 2000,
  };

  function setRandomString() {
    const length = 30;
    let charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const pickColor = (e) => {
    setData({ ...data, color: e.hex });
  };

  const pickImageFiles = (e) => {
    setImages(e.target.files);
  };

  const cover = {
    position: "absolute",
    content: "",
    top: "0px",
    marginRight: "0px",
    bottom: "0px",
    marginLeft: "0px",
    width: "100vw",
    height: "auto",
    zIndex: "2",
    backgroundColor: "rgba(100,90,90,0.3)",
  };

  const popover = {
    position: "absolute",
    zIndex: "3",
  };

  const getUser = async () => {
    await checkToken();
    const resJson = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const res = await resJson.json();
    if (res && res.status === true) {
      dispatch({ type: "SET_USER", payload: res.data });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images && !data.color && !data.description && !data.inStock) {
      return Swal.fire(alertMsgError);
    }
    setOnload(true);
    await checkToken();
    let detailsProduct;
    let imgList = [];
    if (images) {
      for (let i = 0; i < images.length; i++) {
        await S3Uploader.uploadFile(images[i], setRandomString())
          .then((data) => imgList.push(data.location))
          .catch((err) => {
            console.error(err);
            setOnload(false);
          });
      }
    }
    if (imgList && imgList.length !== 0) {
      detailsProduct = { ...data, images: imgList };
    } else {
      detailsProduct = { ...data };
    }
    sendUpdateDetails(detailsProduct);
  };

  const sendUpdateDetails = async (o) => {
    Object.keys(o).forEach((el) => {
      if (!o[el]) {
        delete o[el];
      }
    });
    if (Object.keys(o).length === 0) {
      return;
    }
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(o),
    };
    const response = await fetch(
      process.env.REACT_APP_SERVER +
        "/category/" +
        props.product.type.slug +
        "/products/" +
        props.product.product._id +
        "/" +
        props.product._id,
      options
    );
    const result = await response.json();
    if (result.status === true) {
      await getUser();
      Swal.fire(alertMsgSuccess);
      setOnload(false);
      setData(null);
      props.setOpenDetails(false);
      props.setProduct(null);
    } else if (result.message === "Not authorized") {
      Swal.fire(alertMsgNotAuthorized);
      setOnload(false);
    } else {
      Swal.fire(alertMsgFetchError);
      setOnload(false);
    }
  };

  if (!props.product) {
    return <div></div>;
  }

  return (
    <div>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        {displayColorPicker ? (
          <div style={cover} onClick={handleClose} />
        ) : null}
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Details Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.Fragment>
            <form onChange={onChangeDetailsSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current Color:{" "}
                    {props.product.color === "rally" ? (
                      <span>
                        <img className="color-icon" src={rally} />
                      </span>
                    ) : (
                      <span
                        style={{ backgroundColor: props.product.color }}
                        className="color-icon"
                      ></span>
                    )}
                  </div>
                  <TextField
                    onClick={handleClick}
                    label="Choose Color"
                    value={data && data.color ? data.color : ""}
                    name="color"
                    inputProps={{
                      style: {
                        color: data && data.color ? data.color : "#000",
                      },
                    }}
                    fullWidth
                  />
                  {displayColorPicker ? (
                    <div style={popover}>
                      <ChromePicker
                        color={data && data.color ? data.color : ""}
                        onChange={pickColor}
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2"></div>
                  <TextField
                    required
                    variant="outlined"
                    id="standard-required"
                    label="Description"
                    value={data && data.description ? data.description : ""}
                    name="description"
                    fullWidth
                    type="text"
                    multiline={true}
                    rows="4"
                    inputProps={{
                      minLength: 20,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current availability in stock: {props.product.availability}
                  </div>
                  <TextField
                    variant="outlined"
                    className={classes.textField}
                    id="standard-required"
                    label="In stock"
                    value={data && data.inStock ? data.inStock : ""}
                    name="inStock"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <span className="mr-1">Add more images: </span>
                    <input
                      accept="image/*"
                      className={classes.input}
                      name="images"
                      onChange={pickImageFiles}
                      multiple={false}
                      id="icon-button-file"
                      type="file"
                    />
                  </div>
                </Grid>
              </Grid>
            </form>
          </React.Fragment>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={onload ? true : false}
            className="mr-2"
            endIcon={
              !onload ? (
                <Icon>send</Icon>
              ) : (
                <CircularProgress size={22} thickness={2} />
              )
            }
          >
            Submit
          </Button>
          <Button
            variant="contained"
            className="mr-2"
            onClick={() => {
              props.setOpenDetails(false);
              setData(null);
              props.setProduct(null);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
