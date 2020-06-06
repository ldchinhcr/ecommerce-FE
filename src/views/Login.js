import React, { useState, useEffect } from "react";
import {TextField, ButtonGroup, InputAdornment, Icon, Button} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import GitHubIcon from "@material-ui/icons/GitHub";
import LockIcon from "@material-ui/icons/Lock";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { loadCSS } from "fg-loadcss";
import { useHistory, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from 'react-reveal/Fade';
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
    },
  },
  formControl: {
    margin: theme.spacing(1),
  },
  blue: {
    color: "#052c6b!important",
  },
  black: {
    color: "#000 !important",
  },
  bgwhite: {
    backgroundColor: "#ffffff!important",
  },
  white: {
    color: "#fff",
  }
}));

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [onload, setOnload] = useState(false);
  useEffect(() => {
    const node = loadCSS(
      "https://kit-pro.fontawesome.com/releases/v5.12.0/css/pro.min.css",
      document.querySelector("#font-awesome-css")
    );

    return () => {
      node.parentNode.removeChild(node);
    };
  });
  const classes = useStyles();
  let [attribute, setAttribute] = useState(false);
  let [user, setUser] = useState(null);

  const alertMsgError = {
    title: "Error!!!",
    text: "Your email or password is not correct!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1500,
  }

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttribute(true);
    setOnload(true);
    const response = await fetch(
      process.env.REACT_APP_SERVER + "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    const resjson = await response.json();
    if (resjson.status === true) {
      localStorage.setItem("token", resjson.token);
      dispatch({ type: "SET_USER", payload: resjson.user });
      history.push("/");
    } else {
      Swal.fire(alertMsgError);
    }
    setAttribute(false);
    setOnload(false);
  };

  return (
    <Fade opposite>
    <div className="centered-form">
      <div className="centered-form__box">
        <div
          className="text-center login-header card-header card-header-primary"
          style={{ borderRadius: "10px" }}
        >
          <LockIcon style={{ fontSize: "46px", marginTop: "-10px" }} />
        </div>
        <form onChange={onChange} onSubmit={onSubmit} className="pt-3">
          <div>
            <TextField
              required
              id="standard-required"
              name="email"
              label="Email"
              style={{ marginBottom: "10px" }}
              type="email"
              autoComplete="off"
              disabled={attribute}
              className="form-input"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountCircle className="input-icon"/>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div>
            <TextField
              required
              id="standard-required"
              name="password"
              label="Password"
              style={{ marginBottom: "10px" }}
              type="password"
              autoComplete="off"
              disabled={attribute}
              className="form-input"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <VpnKeyIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.root}>
            <Button
              variant="contained"
              disabled={attribute}
              className="form-input"
              type="submit"
              endIcon={!onload ? <Icon>send</Icon> : <span className="d-flex flex-row align-items-center"><CircularProgress className={classes.white} size={22}
              thickness={2}/></span>}
            >
            {!onload ? "Login" : ''}
            </Button>
          </div>
        </form>
        <div className="w-100 text-center">
          <div style={{ margin: "10px" }}>
            <Link to="/forgotpassword">Forgot your password?</Link>
          </div>
          <div style={{ margin: "10px" }}>
            Not register yet? <Link to="/register">Register now</Link>
          </div>
        </div>
        <h2 className="h2-or">
          <span className="span-or">Or</span>
        </h2>
        <div className={classes.root}>
          <ButtonGroup
            aria-label="contained button group"
            variant="contained"
            className="form-input"
          >
            <Button
              className="form-input"
              href={process.env.REACT_APP_SERVER + "/auth/facebook"}
            >
              <FacebookIcon className={classes.blue}/>
            </Button>
            <Button
              className="form-input"
              href={process.env.REACT_APP_SERVER + "/auth/google"}
            >
              <Icon
                style={{ fontSize: "20px", margin: "0" }}
                className={`${classes.bgwhite} fab fa-google`}
              />
            </Button>
            <Button
              className="form-input"
              href={process.env.REACT_APP_SERVER + "/auth/github"}
            >
              <GitHubIcon className={classes.black}/>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
    </Fade>
  );
}
