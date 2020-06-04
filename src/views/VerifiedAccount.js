import React, { useState, useEffect } from "react";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import { useHistory } from "react-router-dom";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Fade from 'react-reveal/Fade';
import checkToken from "../components/RefreshToken";
import { useDispatch } from "react-redux";


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function VerifiedAccount() {
  const history = useHistory();
  const [successVerifed, setSuccessVerifed] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    getResetToken();
  }, []);

  const getResetToken = async () => {
    const tokenUrl = window.location.href.split("?verifytoken=")[1]
      ? window.location.href.split("?verifytoken=")[1]
      : null;
    if (!tokenUrl) {
      history.push("/");
    }
    setVerify(tokenUrl);
  };

  const setVerify = async (token) => {
    await checkToken();
    const response = await fetch(process.env.REACT_APP_SERVER + "/users/verifyaccount", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({token: token}),
    });
    const resJson = await response.json();
    if (resJson.status === true) {
      if (localStorage.getItem('token')) {
        await fetchUserAgain();
      }
      setSuccessVerifed(true);
    } else {
      console.log("Something went wrong, try again later!!!");
    }
  }

  const fetchUserAgain = async() => {
    const resJson = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
      headers: {
        authorization: 'Bearer ' + localStorage.getItem('token')
      },
    });
    if (resJson && resJson.status === 200) {
      const res = await resJson.json();
      dispatch({ type: "SET_USER", payload: res.data });
    } else {
      console.log("Something went wrong, try again later!!!");
    }
  }

  if (!successVerifed) {
    return (
      <Backdrop className={classes.backdrop} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }
  return (
    <Fade opposite>
    <div className="centered-form-reg">
      <div className="centered-form__box-reg" style={{ borderRadius: "20px" }}>
        <div
          className="text-center login-header card-header card-header-primary"
          style={{ borderRadius: "10px" }}
        >
          <HowToRegIcon
            style={{ fontSize: "46px", marginTop: "-10px", color: "green" }}
          />
        </div>
        <div className="text-center mt-3">
          Your registration has been successfully! Thank you!
        </div>
      </div>
    </div>
    </Fade>
  );
}
