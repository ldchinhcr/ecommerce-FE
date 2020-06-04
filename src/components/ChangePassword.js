import React, { useState } from "react";
import TelegramIcon from "@material-ui/icons/Telegram";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useSelector} from "react-redux";
import Swal from "sweetalert2";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    margin: "20px 40px",
  },
  button: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
  },
  white: {
    color: "#fff",
  },
  textNotifications: {
    margin: "10px 40px",
  }
}));

export default function ChangePassword() {
  const classes = useStyles();
  const [attribute, setAttribute] = useState(false);
  const [obj, setObj] = useState(null);
  const [onload, setOnload] = useState(false);
  const [valid, setValid] = useState(true);
  const user = useSelector(state => state.user);

  const alertMsgSuccess = {
    title: "Success!!!",
    text: "Your password has been updated successfully!",
    icon: "success",
    showConfirmButton: false,
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!!!",
    text: "Something went wrong, please try again later!",
    icon: "error",
    showConfirmButton: false,
    timer: 1500,
  };

  const alertMsgRequired = {
    title: "Warning!!!",
    text: "Please provide all required information!",
    icon: "warning",
    showConfirmButton: false,
    timer: 1500,
  };

  const onChange = (e) => {
    setObj({ ...obj, [e.target.name]: e.target.value });
    const validPass = { ...obj, [e.target.name]: e.target.value };
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
    setOnload(true);
    setAttribute(true);
    if (user.socialsOAuth) {
      if (!obj.password || !obj.passwordConfirm) {
        Swal.fire(alertMsgRequired);
        setAttribute(false);
        setOnload(false);
        return;
      }
    } else if (!obj.currentPassword || !obj.password || !obj.passwordConfirm) {
      Swal.fire(alertMsgRequired);
      setAttribute(false);
      setOnload(false);
      return;
    }
    const response = await fetch(
      process.env.REACT_APP_SERVER + "/users/updatepassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(obj),
      }
    );
    const resjson = await response.json();
    if (resjson.status === true) {
      Swal.fire(alertMsgSuccess);
    } else {
      Swal.fire(alertMsgError);
      setObj(null);
    }
    setAttribute(false);
    setOnload(false);
  };
  return (
    <form
      className={classes.root}
      onChange={onChange}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <div className="w-100 text-center">
      <p>
        Fill out this box with your current password and new password then click
        send to continue.
    </p>
      </div>
      {user.socialsOAuth ? null : 
        <TextField
        variant="outlined"
        className={classes.textField}
        required
        id="standard-required"
        label="Current Password"
        value={obj && obj.currentPassword ? obj.currentPassword : ''}
        name="currentPassword"
        type="password"
        inputProps={{
            minLength: 8,
            maxLength: 32,
          }}
        fullWidth
        disabled={attribute}
      />}
      <TextField
        variant="outlined"
        className={classes.textField}
        required
        id="standard-required"
        value={obj && obj.password ? obj.password : ''}
        label="New Password"
        name="password"
        type="password"
        inputProps={{
            minLength: 8,
            maxLength: 32,
          }}
        fullWidth
        disabled={attribute}
      />
      <TextField
        variant="outlined"
        className={classes.textField}
        required
        id="standard-required"
        label="Confirm New Password"
        name="passwordConfirm"
        value={obj && obj.passwordConfirm ? obj.passwordConfirm : ''}
        type="password"
        inputProps={{
            minLength: 8,
            maxLength: 32,
          }}
          error={!valid}
          helperText={
            valid
              ? ""
              : "Password Confirm must be at the same with password."
          }
        fullWidth
        disabled={attribute}
      />
      <div className="w-100 d-flex justify-content-center">
        <Button
          variant="contained"
          type="submit"
          className={classes.button}
          endIcon={
            !onload ? (
              <TelegramIcon/>
            ) : (
              <CircularProgress
                className={classes.white}
                size={22}
                thickness={2}
              />
            )
          }
        >
        Send
        </Button>
      </div>
    </form>
  );
}
