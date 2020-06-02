import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  IconButton,
  CircularProgress,
  Icon,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Check from "@material-ui/icons/Check";
import ChromePicker from "react-color";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import configS3 from "../utils/AWSS3";
import S3 from "react-aws-s3";
import checkToken from "./RefreshToken";


const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#1c31eb",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#1c31eb",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#1c31eb",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#1c31eb",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
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
  return ["Choose Type", "Choose Product", "Add new detail product"];
}

export default function CustomizedSteppers() {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [category, setCategory] = useState(null);
  const [list, setList] = useState(null);
  const [userChosen, setUserChosen] = useState(null);
  const [details, setDetails] = useState({ color: "#000" });
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [images, setImages] = useState(null);
  const [onload, setOnload] = useState(false);
  const [attribute, setAttribute] = useState(false);
  const [noList, setNoList] = useState(null);

  const history = useHistory();
  useEffect(() => {
    if (!category) {
      getCategory();
    }
  }, [category]);

  const S3Uploader = new S3(configS3);

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

  const onChangeChosen = (e) => {
    if (e.target.name === "type") {
      getListProduct(e.target.value);
      if (userChosen && userChosen.product) {
        delete userChosen.product;
      }
    }
    setUserChosen({ ...userChosen, [e.target.name]: e.target.value });
  };

  const onChangeDetailsSubmit = (e) => {
    if (e.target.name !== "images") {
      setDetails({ ...details, [e.target.name]: e.target.value });
    }
  };

  const pickColor = (e) => {
    setDetails({ ...details, color: e.hex });
  };

  const pickImageFiles = (e) => {
    setImages(e.target.files);
  };

  const getCategory = async function () {
    const res = await fetch(process.env.REACT_APP_SERVER + "/category");
    const resJson = await res.json();
    if (resJson.status === true) {
      setCategory(resJson.categories);
    } else {
      alert("Something went wrong");
      history.push("/");
    }
  };

  const getListProduct = async function (cat) {
    const res = await fetch(process.env.REACT_APP_SERVER + "/category/" + cat + "/alllist");
    const resJson = await res.json();
    if (resJson.status === true) {
      setList(resJson.products);
      setNoList(null);
    } else {
      setNoList("This category does not have any products!")
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

  const listProducts =
    list &&
    list.map((item) => {
      return (
        <MenuItem value={item.slug} key={item.name}>
          {item.name}
        </MenuItem>
      );
    });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
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

  const onSubmit = async () => {
    setOnload(true);
    setAttribute(true);
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
            setAttribute(false);
          });
      }
    }
    if (imgList && imgList.length !== 0) {
      detailsProduct = { ...details, images: imgList };
    } else {
      detailsProduct = { ...details };
    }
    const res = await fetch(
      process.env.REACT_APP_SERVER +
        "/category/" +
        userChosen.type +
        "/products/" +
        userChosen.product,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(detailsProduct),
      }
    );
    const resJson = await res.json();
    if (resJson.status === true) {
      setImages(null);
      setDetails({ color: "#000" });
      setUserChosen(null);
      setOnload(false);
      setAttribute(false);
      alert("Your product has been created");
      history.push(`/category/${userChosen.type}/products/${userChosen.product}/${resJson.data.slug}`)
    } else {
      alert("Something went wrong, try again later!");
      setOnload(false);
      setAttribute(false);
    }
  };
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
              value={userChosen && userChosen.type ? userChosen.type : ""}
              onChange={onChangeChosen}
            >
              {listCategory}
            </Select>
          </FormControl>
        );
      case 1:
        return (
          <div>
          {noList ? <p>{noList}</p> :
          <FormControl className={classes.formControl}>
            <InputLabel id="type-select">Choose Product</InputLabel>
            <Select
              labelId="type-select"
              defaultValue=""
              id="type-select"
              name="product"
              value={userChosen && userChosen.product ? userChosen.product : ""}
              onChange={onChangeChosen}
            >
              {listProducts}
            </Select>
          </FormControl>}</div>
        );
      case 2:
        return (
          <form
            onChange={onChangeDetailsSubmit}
            className={classes.root}
            noValidate
            autoComplete="off"
          >
            <FormControl>
              <TextField
                onClick={handleClick}
                className={classes.textField}
                label="Choose Color"
                value={details && details.color}
                name="color"
                inputProps={{
                  style: {
                    color: details.color ? details.color : "#000",
                  },
                }}
                fullWidth
              />
              {displayColorPicker ? (
                <div style={popover}>
                  <ChromePicker
                    color={details && details.color ? details.color : ""}
                    onChange={pickColor}
                  />
                </div>
              ) : null}
              <TextField
                className={classes.textField}
                variant="outlined"
                required
                id="standard-required"
                label="Description for Product"
                value={
                  details && details.description ? details.description : ""
                }
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
                  <label
                    htmlFor="icon-button-file"
                    className={classes.avatarBtn}
                  >
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

  return (
    <div className={classes.root}>
      {displayColorPicker ? <div style={cover} onClick={handleClose} /> : null}
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography component="div" className={classes.instructions}>
              <GridContainer>
                <GridItem>
                  <p>Summary</p>
                  <div>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Type:{" "}
                      {userChosen && userChosen.type ? (
                        userChosen.type
                      ) : (
                        <span className="text-danger">Not chosen yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Product:{" "}
                      {userChosen && userChosen.product ? (
                        userChosen.product
                      ) : (
                        <span className="text-danger">Not chosen yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Description:{" "}
                      {details && details.description ? (
                        details.description
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Color:{" "}
                      {details && details.color ? (
                        details.color
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p style={{ borderBottom: "1px solid gray" }}>
                      Stock:{" "}
                      {details && details.inStock ? (
                        details.inStock
                      ) : (
                        <span className="text-danger">Not input yet</span>
                      )}
                    </p>
                    <p>
                      Images:{" "}
                      {images ? (
                        [...images].map((i) => <span>{i.name}, </span>)
                      ) : (
                        <span className="text-muted">Not Post</span>
                      )}
                    </p>
                  </div>
                </GridItem>
              </GridContainer>
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
            {userChosen &&
            userChosen.type &&
            userChosen.product &&
            details &&
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
                className={classes.button}
                onClick={onSubmit}
                disabled={true}
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
          </div>
        ) : (
          <div>
            <Typography component="div" className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
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
                  activeStep === 0 && userChosen && userChosen.type
                    ? false
                    : activeStep === 1 && userChosen && userChosen.product
                    ? false
                    : activeStep === 2 &&
                      details &&
                      details.description &&
                      details.color &&
                      details.inStock
                    ? false
                    : true
                }
              >
                {activeStep === steps.length - 1 ? "Summary" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}