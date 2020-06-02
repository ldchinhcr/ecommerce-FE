import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  InputAdornment,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import CreateIcon from "@material-ui/icons/Create";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import HowToRegIcon from "@material-ui/icons/HowToReg";
import CircularProgress from '@material-ui/core/CircularProgress';
import TelegramIcon from '@material-ui/icons/Telegram';
import Fade from 'react-reveal/Fade';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  white: {
    color: "#fff"
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: grey[50],
    backgroundColor: grey[500],
    "&:hover": {
      backgroundColor: grey[700],
    },
  },
}))(Button);

const GreenCheckbox = withStyles({
  root: {
    color: grey[400],
    "&$checked": {
      color: grey[600],
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function Register() {
  const classes = useStyles();
  const [state, setState] = useState(null);
  const [checkedBox, setCheckedBox] = useState(false);
  const [attribute, setAttribute] = useState(false);
  const [valid, setValid] = useState(true);
  const [warning, setWarning] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  const [onload, setOnload] = useState(false);

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    const validPass = { ...state, [e.target.name]: e.target.value };
    if (validPass) {
      if (validPass.password && validPass.passwordConfirm) {
          if (validPass.password === validPass.passwordConfirm) {
            setValid(true);
          }
          else {
          setValid(false);
        }
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttribute(true);
    setOnload(true);
    if (!valid || !checkedBox) {
      setWarning(
        "Please check all value has been entered and make sure agreed with our ToS."
      );
      setAttribute(false);
      return;
    }
    const userToReg = {
      name: `${state.firstName}${state.lastName ? " " + state.lastName : ""}`,
      password: state.password,
      passwordConfirm: state.passwordConfirm,
      email: state.email,
    };
    const response = await fetch(process.env.REACT_APP_SERVER + "/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userToReg),
    });
    const resJson = await response.json();
    if (resJson.status === true) {
      setAttribute(false);
      setRegSuccess(true);
    } else {
      alert("Something went wrong, try again later");
    }
    setOnload(false);
  };

  
  if (regSuccess) {
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
          Your registration has been successfully! Please check your email to verify your registration! Thank you!
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fade opposite>
    <div className="centered-form-reg">
      <div className="centered-form__box-reg"  style={{borderRadius: "20px"}}>
        <div
          className="text-center login-header card-header card-header-primary"
          style={{ borderRadius: "10px" }}
        >
          <HowToRegIcon style={{ fontSize: "46px", marginTop: "-10px" }} />
        </div>
        <div className="text-center">
          {warning ? <p style={{ color: "red" }}>{warning}</p> : ""}
        </div>
        <form onChange={onChange} onSubmit={onSubmit} autoComplete="off">
          <div className={classes.root}>
            <TextField
              className={classes.textField}
              id="standard-required"
              label="First Name"
              margin="normal"
              disabled={attribute}
              name="firstName"
              type="text"
              required
              style={{ width: "47%" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AccountBoxIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className={classes.textField}
              id="standard-required"
              label="Last Name"
              margin="normal"
              disabled={attribute}
              name="lastName"
              type="text"
              style={{ width: "47%" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PersonPinIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              className={classes.textField}
              required
              id="standard-required"
              label="Email"
              name="email"
              type="email"
              fullWidth
              disabled={attribute}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AlternateEmailIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
            />
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
            <FormControlLabel
              control={
                <GreenCheckbox
                  checked={checkedBox}
                  disabled={attribute}
                  onChange={() => setCheckedBox(!checkedBox)}
                />
              }
              label="By creating an account, you agree to our Privacy Policy and Terms. We’ll send you updates on all things. Need to take off? Unsubscribe anytime."
            />
            <div className="w-100 d-flex justify-content-center align-items-center">
              <ColorButton
                variant="contained"
                color="primary"
                type="submit"
                disabled={attribute}
                endIcon={!onload ? <TelegramIcon/> : <CircularProgress className={classes.white} size={22}
                thickness={2}/>}
                >
                Register
              </ColorButton>
            </div>
          </div>
        </form>
      </div>
    </div>
    </Fade>
  );
}
