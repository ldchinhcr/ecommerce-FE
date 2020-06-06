import React, { useState } from "react";
import TelegramIcon from '@material-ui/icons/Telegram';
import { makeStyles } from "@material-ui/core/styles";
import {
    TextField,
    InputAdornment,
    Button
  } from "@material-ui/core";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from 'react-reveal/Fade';
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

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
        padding: theme.spacing(2),
    },
    white: {
      color: "#fff"
    },
  }));

export default function ForgotPassword() {
  const classes = useStyles();
  const [attribute, setAttribute] = useState(false);
  const [email, setEmail] = useState(null);
  const [doneSend, setDoneSend] = useState(false);
  const [onload, setOnload] = useState(false);

  const onChange = (e) => {
      setEmail({...email, [e.target.name] : e.target.value});
  }

  const alertMsgError = {
    title: "Error!!!",
    text: "Please enter a valid email!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1500,
  };

  const alertMsgNotFound = {
    title: "Error!!!",
    text: "Something went wrong, try again later!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1500,
  };

  const onSubmit = async (e) => {
      setOnload(true);
      e.preventDefault();
      setAttribute(true)
      if (!email) {
          Swal.fire(alertMsgError);
          setAttribute(false);
          return;
      }
      const response = await fetch(
        process.env.REACT_APP_SERVER + "/users/forgotpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        }
      );
      const resjson = await response.json();
      if (resjson.status === true) {
        setDoneSend(true)
      } else {
        Swal.fire(alertMsgNotFound);
        setEmail(null);
      }
      setAttribute(false);
      setOnload(false);
  }

  if (doneSend) {
      return (
        <Fade opposite>
        <div className="centered-form-reg">
        <div className="centered-form__box-reg" style={{borderRadius: "20px"}}>
          <div
            className="text-center login-header card-header card-header-primary"
            style={{ borderRadius: "10px" }}
          >
            <DoneAllIcon style={{ fontSize: "46px", marginTop: "-10px", color: "green"}} />
          </div>
          <div className="text-center mt-3">
            An email with a link to reset password has been sent to your email address! Please check in your inbox.
          </div>
        </div>
      </div>
      </Fade>
      )
  }
    
  return (
    <Fade opposite>
    <div className="centered-form-reg">
      <div className="centered-form__box-reg" style={{ borderRadius: "20px" }}>
      <form className={classes.root} onChange={onChange} onSubmit={onSubmit} autoComplete="off">
          <p>
            Fill out this box with your current email in use and click next to
            continue.
          </p>
          <TextField
            variant="outlined"
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
          <div className="w-100 d-flex justify-content-end">
          <Button
          variant="contained"
          color="primary"
          type="submit"
          className={classes.button}
        >
        {!onload ? <span>Send <TelegramIcon/></span> : <CircularProgress className={classes.white} size={24}
        thickness={4}/>}
        </Button>
        </div>
        </form>
      </div>
    </div>
    </Fade>
  );
}
