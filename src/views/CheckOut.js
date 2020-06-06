import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import AddressForm from "../components/AddressForm";
import PaymentForm from "../components/PaymentForm";
import ReviewBill from "../components/ReviewBill";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import checkToken from "../components/RefreshToken";
import dataListCountry from "../assets/data-country.json";
import Swal from 'sweetalert2/src/sweetalert2.js'
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    position: "relative",
    top: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "5vh",
    minHeight: "93vh",
    [theme.breakpoints.up(1000 + theme.spacing(2) * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const steps = ["Shipping address", "Payment details", "Review your order"];

export default function CheckOut() {
  const classes = useStyles();
  const history = useHistory();
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [regionList, setRegionList] = useState([]);

  const [infoShipping, setInfoShipping] = useState({
    fullname: "",
    addressLine1: "",
    addressLine2: "",
    telephone: "",
    zipCode: "",
    city: "",
    region: "",
    country: "",
  });

  const [cardInfo, setCardInfo] = useState({
    number: "",
    name: "",
    month: "",
    year: "",
    cvc: "",
  });

  const [validateCard, setValidateCard] = useState(false);

  const [onload, setOnload] = useState(false);

  const handleNext = async() => {
    if (activeStep === 2) {
      setOnload(true);
      await placeOrder();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const alertMsgOverAvailable = (text) => {
    return {
      title: "Warning!!!",
      text: `Some products has been exceeds current available quantity, ${text}!`,
      icon: "warning",
      showConfirmButton: false,
      iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
      timer: 1500,
    }
  }

  const onChangeInfo = (e) => {
    if (e.target.name === "telephone") {
      const value = e.target.value.replace(/\D/g, "");
      setInfoShipping({ ...infoShipping, [e.target.name]: value });
    } else if (e.target.name === "country") {
      setInfoShipping({ ...infoShipping, [e.target.name]: e.target.value });
      const index = dataListCountry.findIndex(el => el.countryName === e.target.value);
      setRegionList(dataListCountry[index].regions);
    } else {
      setInfoShipping({ ...infoShipping, [e.target.name]: e.target.value });
    }
  };

  const placeOrder = async() => {
    try {
    await checkToken();
    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({cardInfo, infoShipping})
    };
    const resJson = await fetch(process.env.REACT_APP_SERVER + '/cart/checkout', options);
    const res = await resJson.json();
    if (res.status === true) {
      setOrderData(res.data);
      setActiveStep(activeStep + 1);
      setOnload(false);
      await deleteCartToBE();
      await getUser();
    } else if (res.message.startsWith("Over Availability")) {
      Swal.fire(alertMsgOverAvailable(res.message));
      setOnload(false);
    } else {
      setOnload(false);
    }
  } catch (err) {
    console.log(err.message);
  }
  };

  const backToExplore = () => {
    setOrderData(null);
    history.push("/explore");
  };

  const getUser = async() => {
    await checkToken();
    const resJson = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const res = await resJson.json();
    if (res && res.status === true) {
      dispatch({ type: "SET_USER", payload: res.data });
  }
}

  const deleteCartToBE = async() => {
    try {
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    }
    const response = await fetch(process.env.REACT_APP_SERVER + '/cart', options);
    if (response.status === 204) {
      dispatch({type: "UPDATE_CART", payload: []});
      console.log('Successfully deleted cart.')
    }
  } catch (err) {
    console.log(err.message)
  }
  };

  if (!user || (cart.length === 0 && !orderData)) {
    history.replace("/");
  }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <AddressForm
            onChangeInfo={onChangeInfo}
            infoShipping={infoShipping}
            dataListCountry={dataListCountry}
            regionList={regionList}
          />
        );
      case 1:
        return (
          <PaymentForm
            cardInfo={cardInfo}
            setCardInfo={setCardInfo}
            validateCard={validateCard}
            setValidateCard={setValidateCard}
          />
        );
      case 2:
        return <ReviewBill infoShipping={infoShipping} cardInfo={cardInfo} />;
      default:
        throw new Error("Unknown step");
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? ( orderData ?
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Thank you for your order.
                </Typography>
                <Typography variant="subtitle1">
                  Your order number is #{orderData._id}. We have emailed your order
                  confirmation, and will send you an update when your order has
                  shipped.
                </Typography>
                <div className="w-100 d-flex justify-content-center align-items-center"><Button onClick={backToExplore}>Explore More</Button></div>
              </React.Fragment> : (
                <React.Fragment>
                <Typography variant="h5" gutterBottom>
                <div>On Loading ...</div>
                </Typography>
              </React.Fragment>
              )
            ) : (
              <React.Fragment>
                {getStepContent(activeStep)}
                <div className={classes.buttons}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    className={classes.button}
                    disabled={
                      activeStep === 0 &&
                      infoShipping.fullname &&
                      infoShipping.addressLine1 &&
                      infoShipping.telephone &&
                      infoShipping.zipCode &&
                      infoShipping.city &&
                      infoShipping.country
                        ? false
                        : activeStep === 1 &&
                          cardInfo.number &&
                          cardInfo.name &&
                          cardInfo.month &&
                          cardInfo.year &&
                          cardInfo.cvc &&
                          validateCard
                        ? false
                        : activeStep === 2 &&
                          !onload
                        ? false
                        : true
                    }
                  >
                    {activeStep === steps.length - 1 ? (
                      onload ? (
                        <CircularProgress
                          className={classes.white}
                          size={22}
                          thickness={2}
                        />
                      ) : (
                        "Place order"
                      )
                    ) : (
                      "Next"
                    )}
                  </Button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}

