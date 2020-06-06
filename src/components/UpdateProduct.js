import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Icon, Button } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import configS3 from "../utils/AWSS3";
import S3 from "react-aws-s3";
import checkToken from "./RefreshToken";
import { Modal } from "react-bootstrap";
import Swal from 'sweetalert2/src/sweetalert2.js';
import { CircularProgress } from "@material-ui/core";
import { useDispatch } from "react-redux";
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

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

export default function UpdateProduct(props) {
  const classes = useStyles();
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  const [srcCover, setSrcCover] = useState(null);
  const [fileCover, setFileCover] = useState(null);
  const [onload, setOnload] = useState(false);

  const S3Uploader = new S3(configS3);

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
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
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

  const alertMsgDiscount = {
    title: "Error!!!",
    text: "Discount must be between 0 and 100!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 2000,
  };

  const pickCoverImg = (e) => {
    if (e.target.files[0]) {
      setFileCover(e.target.files[0]);
      setSrcCover(URL.createObjectURL(e.target.files[0]));
    } else {
      setSrcCover(null);
    }
  };

  const onHandleChange = (e) => {
    if (e.target.name !== "imageCover") {
      setData({ ...data, [e.target.name]: e.target.value });
    }
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
    setOnload(true);
    if (!fileCover && !data.name && !data.price && !data.priceDiscount) {
      Swal.fire(alertMsgError);
      setOnload(false);
      return;
    }
    if (
      (data.priceDiscount && data.priceDiscount < 0) ||
      (data.priceDiscount && data.priceDiscount > 100)
    ) {
      Swal.fire(alertMsgDiscount);
      setOnload(false);
      return;
    }
    if (fileCover) {
      await S3Uploader.uploadFile(fileCover, setRandomString())
        .then((data) => {
          const obj = { ...data, imageCover: data.location };
          handleUpdate(obj);
        })
        .catch((err) => {
          console.error(err);
          setOnload(false);
        });
    } else {
      handleUpdate(data);
    }
  };

  const handleUpdate = async (o) => {
    await checkToken();
    Object.keys(o).forEach((el) => {
      if (!o[el]) {
        delete o[el];
      }
    });
    console.log(o);
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
        props.product.product._id,
      options
    );
    const result = await response.json();
    if (result.status === true) {
      await getUser();
      Swal.fire(alertMsgSuccess);
      setOnload(false);
      setData(null);
      props.setOpenRoot(false);
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
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Root Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <React.Fragment>
            <form onChange={onHandleChange}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current Name: {props.product.product.name}
                  </div>
                  <TextField
                    required
                    variant="outlined"
                    id="name"
                    name="name"
                    value={data && data.name ? data.name : ""}
                    label="Product Name"
                    fullWidth
                    autoComplete="full-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current Price: {props.product.product.price}
                  </div>
                  <TextField
                    required
                    variant="outlined"
                    id="standard-required"
                    label="Price"
                    value={data && data.price ? data.price : ""}
                    name="price"
                    type="number"
                    fullWidth
                    InputProps={{
                      inputProps: { min: "1" },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current discount:{" "}
                    {props.product.product.priceDiscount
                      ? props.product.product.priceDiscount + " %"
                      : 0}
                  </div>
                  <TextField
                    variant="outlined"
                    className={classes.textField}
                    id="standard-required"
                    label="Discount (if any)"
                    value={data && data.priceDiscount ? data.priceDiscount : ""}
                    name="priceDiscount"
                    type="number"
                    fullWidth
                    error={
                      (data &&
                        data.priceDiscount &&
                        data.priceDiscount * 1 <= 100) ||
                      (data && !data.priceDiscount)
                        ? false
                        : true
                    }
                    helperText={
                      data &&
                      data.priceDiscount &&
                      data.priceDiscount * 1 <= 100
                        ? ""
                        : "Discount must not be greater than 100 percent!!"
                    }
                    InputProps={{
                      inputProps: {
                        min: "0",
                        max: "100",
                        maxLength: "3",
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="mb-2">
                    Current Image Cover:{" "}
                    <span>
                      <img
                        src={props.product.product.imageCover}
                        alt="preview"
                        width="80px"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                      />
                    </span>
                  </div>
                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <input
                      accept="image/*"
                      className={classes.input}
                      onChange={pickCoverImg}
                      multiple={false}
                      id="icon-button-file"
                      type="file"
                    />
                    <label
                      htmlFor="icon-button-file"
                      className={classes.avatarBtn}
                    >
                      {srcCover ? (
                        <span>
                          <img
                            src={srcCover}
                            alt="preview"
                            width="80px"
                            style={{ transform: "translate3d(0, 0, 0)" }}
                          />
                        </span>
                      ) : null}
                    </label>
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
            onClick={() => {
              props.setOpenRoot(false);
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
