import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Stepper,
  TextField,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  IconButton,
  InputAdornment,
  Grid,
  Icon,
  CircularProgress
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import configS3 from "../utils/AWSS3";
import S3 from 'react-aws-s3';
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ColorPicker from "material-ui-color-picker";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import Swal from 'sweetalert2';
import checkToken from "./RefreshToken";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  textField: {
    margin: "20px 0px",
    width: "100%",
  },
  input: {
    display: "none",
  },
  avatarBtn: {
    margin: "0",
  },
}));

function getSteps() {
  return ["Choose Type", "Create Product", "Detail for Product"];
}

export default function NewBaseProduct() {
  const history = useHistory();
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [category, setCategory] = useState("");
  const [baseProduct, setBaseProduct] = useState(null);
  const [fileCover, setFileCover] = useState(null);
  const [images, setImages] = useState(null);
  const [details, setDetails] = useState({ color: "#000" });
  const [srcCover, setSrcCover] = useState(null);
  const [onload, setOnload] = useState(false);
  const [attribute, setAttribute] = useState(false);

  const alertMsgSuccess = {
    title: "Success!",
    text: "Product created successfully!",
    icon: "success",
    confirmButtonText: "Nice"
  };

  const alertMsgError = {
    title: "Error!",
    text: "Something went wrong while fetch new user database!",
    icon: "error",
    confirmButtonText: "Ok!"
  };

  const S3Uploader = new S3(configS3);

  const onChangeStepOne = (e) => {
    if (e.target.name !== "imageCover") {
      setBaseProduct({ ...baseProduct, [e.target.name]: e.target.value });
    }
  };

  const onChangeStepTwo = (e) => {
    if (e.target.name !== "images") {
      setDetails({ ...details, [e.target.name]: e.target.value });
    }
  };

  const pickColor = (e) => {
    setDetails({ ...details, color: e });
  };

  const pickFileCover = (e) => {
    if (e.target.files[0]) {
      setFileCover(e.target.files[0]);
      setSrcCover(URL.createObjectURL(e.target.files[0]));
    } else {
      setSrcCover(null)
    }
  };

  const pickImageFiles = (e) => {
    setImages(e.target.files);
  };

  useEffect(() => {
    if (!category) {
      getCategory();
    }
  }, [category]);

  const getCategory = async function () {
    const res = await fetch(process.env.REACT_APP_SERVER + "/category");
    const resJson = await res.json();
    if (resJson.status === true) {
      setCategory(resJson.categories);
    } else {
      Swal.fire(alertMsgError);
      history.push("/profile");
    }
  };

  const listCategory =
    category &&
    category.map((item) => {
      return (
        <MenuItem value={item.slug} key={item.type}>
          {item.type}
        </MenuItem>
      );
    });

    function setRandomString() {
      const length = 30;
      let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let retVal = "";
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <FormControl className={classes.formControl}>
            <InputLabel id="type-select">Type</InputLabel>
            <Select
              labelId="type-select"
              defaultValue=""
              id="type-select"
              name="type"
              value={baseProduct && baseProduct.type ? baseProduct.type : ""}
              onChange={onChangeStepOne}
            >
              {listCategory}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <form onChange={onChangeStepOne} className={classes.root} noValidate autoComplete="off">
            <TextField
              variant="outlined"
              className={classes.textField}
              required
              id="standard-required"
              label="Name Product"
              value={baseProduct && baseProduct.name ? baseProduct.name : ""}
              name="name"
              type="text"
              inputProps={{
                minLength: "8",
                maxLength: "56",
              }}
              fullWidth
            />
            <TextField
              variant="outlined"
              className={classes.textField}
              required
              id="standard-required"
              label="Price"
              value={baseProduct && baseProduct.price*1 ? baseProduct.price*1 : ""}
              name="price"
              type="number"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AttachMoneyIcon className="input-icon" />
                  </InputAdornment>
                ),
                inputProps: { min: "1" },
              }}
            />
            <TextField
              variant="outlined"
              className={classes.textField}
              id="standard-required"
              label="Discount (if any)"
              value={
                baseProduct && baseProduct.priceDiscount*1
                  ? baseProduct.priceDiscount*1
                  : ""
              }
              name="priceDiscount"
              type="number"
              fullWidth
              error={(baseProduct && baseProduct.priceDiscount && (baseProduct.priceDiscount*1 <= 100)) || (baseProduct && !baseProduct.priceDiscount) ? false : true}
              helperText={baseProduct && baseProduct.priceDiscount && (baseProduct.priceDiscount*1 <= 100) ? "" : 'Discount must not be greater than 100 percent!!'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <i className="fas fa-percent input-icon"></i>
                  </InputAdornment>
                ),
                inputProps: {
                  min: "0",
                  max: "100",
                  maxLength: "3",
                },
              }}
            />
            <Grid container justify="flex-start">
              <div
                className="d-flex flex-row justify-content-start align-items-center"
                style={{
                  marginLeft: "30px",
                  paddingLeft: "30px",
                }}
              >
                <span>Image Cover *</span>
                <input
                  accept="image/*"
                  className={classes.input}
                  name="imageCover"
                  onChange={pickFileCover}
                  multiple={false}
                  id="icon-button-file"
                  type="file"
                />
                <label htmlFor="icon-button-file" className={classes.avatarBtn}>
                  <IconButton
                    aria-label="upload profile picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                  {srcCover ? (
                    <span>
                      <img
                        src={srcCover}
                        alt="preview"
                        width="120px"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                      />
                    </span>
                  ) : null}
                </label>
              </div>
            </Grid>
          </form>
        );
      case 2:
        return (
          <form onChange={onChangeStepTwo} className={classes.root} noValidate autoComplete="off">
          <FormControl>
            <ColorPicker
              variant="outlined"
              name="color"
              defaultValue="#000"
              value={details && details.color}
              label="Color for Product"
              onChange={pickColor}
            />
            <TextField
              className={classes.textField}
              variant="outlined"
              required
              id="standard-required"
              label="Description for Product"
              value={details && details.description ? details.description : ""}
              name="description"
              type="text"
              multiline={true}
              rows="4"
              inputProps={{
                minLength: 20,
              }}
              fullWidth
            />
            <TextField
              variant="outlined"
              className={classes.textField}
              id="standard-required"
              label="In Stock"
              value={details && details.inStock ? details.inStock : ""}
              name="inStock"
              type="number"
              fullWidth
              inputProps={{
                  min: 1,
              }}
            />
            <Grid container justify="flex-start">
              <div
                className="d-flex flex-row justify-content-start align-items-center"
                style={{
                  marginLeft: "30px",
                  paddingLeft: "30px",
                }}
              >
                <span>Images Product</span>
                <label htmlFor="icon-button-file" className={classes.avatarBtn}>
                  <IconButton
                    aria-label="upload profile picture"
                    component="span"
                  >
                    <PhotoCamera />
                  </IconButton>
                  <input
                    accept="image/*"
                    name="images"
                    onChange={pickImageFiles}
                    multiple={true}
                    id="icon-button-file"
                    type="file"
                  />
                </label>
              </div>
            </Grid>
            </FormControl>
          </form>
        );
      default:
        return "Unknown step";
    }
  }

  const onSubmit = async(e) => {
    e.preventDefault();
    setOnload(true);
    setAttribute(true);
    if (baseProduct &&
      images &&
      fileCover &&
      details &&
      baseProduct.type &&
      baseProduct.name &&
      baseProduct.price &&
      details.description &&
      details.color &&
      details.inStock) {
        let listImg = [];
        if (images) {
          for (let i = 0; i < images.length; i++) {
          await S3Uploader.uploadFile(images[i], setRandomString())
          .then((data) => listImg.push(data.location))
          .catch((err) => {
            console.error(err);
            setOnload(false);
            setAttribute(false);
          });
          }
          await S3Uploader.uploadFile(fileCover, setRandomString())
          .then((data) => {
            const obj = {...baseProduct, imageCover: data.location}
            submitCoreProduct(obj, listImg)})
          .catch((err) => {
            console.error(err);
            setOnload(false);
            setAttribute(false);
        });
      } else {
        await S3Uploader.uploadFile(fileCover, setRandomString())
          .then((data) => {
            const obj = {...baseProduct, imageCover: data.location}
            submitCoreProduct(obj, listImg)})
          .catch((err) => {
            console.error(err);
            setOnload(false);
            setAttribute(false);
        });
      }
  };
}

  const submitCoreProduct = async (obj, img) => {
    await checkToken();
    const res = await fetch(process.env.REACT_APP_SERVER + "/category/" + obj.type + "/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(obj)
    });
    const resJson = await res.json();
    if (resJson.status === true) {
      const product = resJson.data
      submitDetailsProduct(obj, product, img);
    } else {
      alert("Something went wrong, try again later!");
      setOnload(false);
      setAttribute(false);
    }
  }

  const submitDetailsProduct = async (obj, product, img) => {
    await checkToken();
    let detailsProduct;
    if (img && img.length !== 0) {
      detailsProduct = {...details, images: img};
    } else {
      detailsProduct = {...details};
    }
    const res = await fetch(process.env.REACT_APP_SERVER + "/category/" + obj.type + "/products/" + product.slug, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(detailsProduct)
    });
    const resJson = await res.json();
    if (resJson.status === true) {
      setOnload(false);
      setAttribute(false);
      setBaseProduct(null);
      setFileCover(null);
      setImages(null);
      setDetails({ color: "#000" });
      setSrcCover(null);
      await Swal.fire(alertMsgSuccess);
      history.push(`/category/${obj.type}/products/${product.slug}/${resJson.data.slug}`)
    } else {
      Swal.fire(alertMsgError);
      setOnload(false);
      setAttribute(false);
    }
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography component="div">{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={
                      activeStep === 0 && baseProduct && baseProduct.type
                        ? false
                        : (activeStep === 1 
                        && baseProduct 
                        && baseProduct.name
                        && baseProduct.price
                        && fileCover
                        && !baseProduct.priceDiscount
                        ) || (
                          activeStep === 1 
                        && baseProduct 
                        && baseProduct.name
                        && baseProduct.price
                        && fileCover
                        && baseProduct.priceDiscount
                        && baseProduct.priceDiscount*1 <=100
                        )
                        ? false
                        : activeStep === 2 &&
                          details &&
                          details.description &&
                          details.color &&
                          details.inStock &&
                          images
                        ? false
                        : true
                    }
                  >
                    {activeStep === steps.length - 1 ? "Summary" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography component="div">
            <GridContainer>
              <GridItem className="flex-start text-justify">
                {baseProduct ? (
                  <div>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Type:{" "}
                      {baseProduct.type ? (
                        baseProduct.type
                      ) : (
                        <span className="text-danger">Not choose yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Name:{" "}
                      {baseProduct.name ? (
                        baseProduct.name
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      CoverImage:{" "}
                      {fileCover ? (
                        fileCover.name
                      ) : (
                        <span className="text-danger">Not choose yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Price:{" "}
                      {baseProduct.price ? (
                        baseProduct.price
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Discount:{" "}
                      {baseProduct.priceDiscount ? (
                        baseProduct.priceDiscount*1 > 100 ? <span className="text-danger">Wrong value. Must be equal or less than 100 percent</span> : baseProduct.priceDiscount
                      ) : (
                        <span className="text-muted">Not Applied</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Description:{" "}
                      {details.description ? (
                        details.description
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Color:{" "}
                      {details.color ? (
                        details.color
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Stock:{" "}
                      {details.inStock ? (
                        details.inStock
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p>
                      Images *:{" "}
                      {images ? (
                        [...images].map((i,index) => <span key={index}>{i.name}, </span>)
                      ) : (
                        <span className="text-muted">Not Post</span>
                      )}
                    </p>
                  </div>
                ) : null}
              </GridItem>
            </GridContainer>
          </Typography>
          <Button onClick={handleReset} className={classes.button} disabled={attribute}>
            Back to Step 1
          </Button>
          {baseProduct &&
          fileCover &&
          details &&
          baseProduct.type &&
          baseProduct.name &&
          baseProduct.price &&
          details.description &&
          details.color &&
          details.inStock ? (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={onSubmit}
              disabled={attribute}
              endIcon={
                !onload ? (
                  <Icon>send</Icon>
                ) : (
                  <CircularProgress
                    className={classes.white}
                    size={22}
                    thickness={2}
                  />
                )
              }
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={true}
              className={classes.button}
              onClick={onSubmit}
              endIcon={
                !onload ? (
                  <Icon>send</Icon>
                ) : (
                  <CircularProgress
                    className={classes.white}
                    size={22}
                    thickness={2}
                  />
                )
              }
            >
              Submit
            </Button>
          )}
        </Paper>
      )}
    </div>
  );
}
