import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  InputAdornment,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import TelegramIcon from "@material-ui/icons/Telegram";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import { useHistory, Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from 'react-reveal/Fade';


const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      margin: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1),
    },
    white: {
      color: "#fff",
      fontSize: "22px"
    }
  }));
export default function ResetPassword() {
    const classes = useStyles();
    const history = useHistory();
    const [attribute, setAttribute] = useState(false);
    const [valid, setValid] = useState(false);
    const [warning, setWarning] = useState("");
    const [data, setData] = useState(null);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const [token, setToken] = useState(null);
    const [onload, setOnload] = useState(false);

    useEffect(() => {
        getResetToken()
      },[])
      const getResetToken = async() => {
        const tokenUrl = window.location.href.split('?resettoken=')[1]
        ? window.location.href.split('?resettoken=')[1] : null;
        if (!tokenUrl) {
            history.push('/')
        }
        setToken(tokenUrl)
      }

    const onChange = (e) => {
        setData({...data, [e.target.name]: e.target.value});
        const validPassword = {...data, [e.target.name]: e.target.value};
        if (
            validPassword &&
            validPassword.password &&
            validPassword.passwordConfirm &&
            validPassword.password !== validPassword.passwordConfirm
          ) {
            setValid(false);
          } else {
            setValid(true);
          }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setOnload(true);
        setAttribute(true);
        if (!token) {
            setAttribute(false);
            history.push('/')
        }
        if ((!data && !data.password) || (!data && !data.passwordConfirm) || !valid) {
          setWarning(
            "Please make sure value has been entered is correct."
          );
          setAttribute(false);
          return;
        }
        const userToReg = {...data, token: token};
        const response = await fetch(process.env.REACT_APP_SERVER + "/users/resetpassword", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToReg),
        });
        const resJson = await response.json();
        if (resJson.status === true) {
          setAttribute(false);
          setChangeSuccess(true);
        } else {
          alert("Something went wrong, try again later");
        }
        setOnload(false);
      };

      if (changeSuccess) {
        return (
          <div className="centered-form-reg">
            <div className="centered-form__box-reg" style={{borderRadius: "20px"}}>
              <div
                className="text-center login-header card-header card-header-primary"
                style={{ borderRadius: "10px" }}
              >
                <HowToRegIcon style={{ fontSize: "46px", marginTop: "-10px", color: "green"}} />
              </div>
              <div className="text-center mt-3">
              Your password has been changed successfully! Please log in again! Thank you!
              </div>
              <div className="w-100 d-flex justify-content-center">
              <Link to="/login">
              <Button
              variant="contained"
              color="primary"
              fullwidth
              className={classes.button}
            >
              To Login Page
            </Button></Link>
            </div>
            </div>
          </div>
        );
      }

    return (
    <Fade opposite>
        <div className="centered-form-reg">
        <div className="centered-form__box-reg" style={{ borderRadius: "20px" }}>
        <form className={classes.root} onChange={onChange} onSubmit={onSubmit}>
            <p>
              Please enter your password and submit.
            </p>
            <p>
            {warning ? <p style={{ color: "red" }}>{warning}</p> : ""}
            </p>
            <TextField
              className={classes.textField}
              id="standard-password-input"
              label="Password"
              type="password"
              name="password"
              fullWidth
              autoFocus
              disabled={attribute}
              error={!valid}
              helperText={
                valid
                  ? ""
                  : "Password must be at the same with password confirm."
              }
              required
              inputProps={{
                minLength: 8,
                maxLength: 32,
              }}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CreateIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={classes.textField}
              id="standard-password-input"
              label="Password Confirm"
              type="password"
              disabled={attribute}
              name="passwordConfirm"
              fullWidth
              minLength="8"
              error={!valid}
              helperText={
                valid
                  ? ""
                  : "Password Confirm must be at the same with password."
              }
              required
              autoComplete="current-password"
              inputProps={{
                minLength: 8,
                maxLength: 32,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CreateIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />
            <div className="w-100 d-flex justify-content-center">
            <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.button}
            >
            {!onload ? <span>Register <TelegramIcon/></span> : <CircularProgress className={classes.white}  size={24}
            thickness={4}/>}
          </Button>
          </div>
          </form>
        </div>
      </div>
    </Fade>
    )
}
