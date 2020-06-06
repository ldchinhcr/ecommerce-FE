import React, { useState } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Icon,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import AlternateEmailIcon from "@material-ui/icons/AlternateEmail";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import S3 from "react-aws-s3";
import { useSelector, useDispatch } from "react-redux";
import configS3 from "../utils/AWSS3";
import Swal from 'sweetalert2/src/sweetalert2.js';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    padding: "0 20px",
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  white: {
    color: "#fff",
  },
  input: {
    display: "none",
  },
  avatarBtn: {
    margin: "0",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ColorButton = withStyles((theme) => ({
  root: {
    color: grey[50],
    marginTop: "30px",
    backgroundColor: grey[500],
    "&:hover": {
      backgroundColor: grey[700],
    },
  },
}))(Button);

export default function ChangeProfile() {
  const classes = useStyles();
  const [attribute, setAttribute] = useState(false);
  const [onload, setOnload] = useState(false);
  const [src, setSrc] = useState(null);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    name: user && user.name,
    email: user && user.email,
    dob: user && user.dob,
    gender: user && user.gender,
    socials: user && user.socials,
  });

  const S3Uploader = new S3(configS3);

  const alertMsgSuccess = {
    title: "Success!!!",
    text: "Your profile has been updated successfully!",
    icon: "success",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-check-circle"></i>',
    timer: 1500,
  };

  const alertMsgError = {
    title: "Error!!!",
    text: "Something went wrong, please try again later!",
    icon: "error",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-times"></i>',
    timer: 1500,
  };

  const alertMsgRequired = {
    title: "Warning!!!",
    text: "Please provide all required information!",
    icon: "warning",
    showConfirmButton: false,
    iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
    timer: 1500,
  };

  const onChange = (e) => {
    const socialsAllowed = ["twitter", "facebook", "instagram"];
    if (e.target.name !== "avatar" || !socialsAllowed.includes(e.target.name)) {
      setState({ ...state, [e.target.name]: e.target.value });
    }
    if (socialsAllowed.includes(e.target.name)) {
      setState({
        ...state,
        socials: { ...state.socials, [e.target.name]: e.target.value },
      });
    }
  };

  const pickDate = (e) => {
    setState({ ...state, dob: e });
  };

  const pickFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setSrc(URL.createObjectURL(e.target.files[0]));
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

  const sendDataWithAvatar = async (data) => {
    const obj = { ...state, avatar: data.location };
    const response = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
      method: "PUT",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const resJson = await response.json();
    if (resJson.status === true) {
      dispatch({ type: "SET_USER", payload: resJson.data });
      Swal.fire(alertMsgSuccess);
    } else {
      Swal.fire(alertMsgError);
    }
    setOnload(false);
    setAttribute(false);
  };

  const sendDataWithOutAvatar = async (data) => {
    const response = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const resJson = await response.json();
    if (resJson.status === true) {
      dispatch({ type: "SET_USER", payload: resJson.data });
      Swal.fire(alertMsgSuccess);
    } else {
      Swal.fire(alertMsgError);
    }
    setOnload(false);
    setAttribute(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAttribute(true);
    setOnload(true);
    if (
      !file &&
      !state.name &&
      !state.email &&
      !state.dob &&
      !state.gender &&
      !state.socials
    ) {
      Swal.fire(alertMsgRequired);
      return;
    }
    if (file) {
      await S3Uploader.uploadFile(file, setRandomString())
        .then((data) => sendDataWithAvatar(data))
        .catch((err) => {
          console.error(err);
          setOnload(false);
          setAttribute(false);
        });
    } else {
      sendDataWithOutAvatar(state);
    }
  };

  return (
    <form onChange={onChange} onSubmit={onSubmit} autoComplete="off">
      <div className={classes.root}>
        <TextField
          className={classes.textField}
          id="standard-required"
          label="Full Name"
          margin="normal"
          disabled={attribute}
          value={state.name}
          name="name"
          type="text"
          fullWidth
          required
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
          required
          id="standard-required"
          label="Email"
          name="email"
          value={state.email}
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

        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container justify="flex-start">
            <KeyboardDatePicker
              margin="normal"
              id="dob"
              label="Date of Birth"
              format="MM/dd/yyyy"
              name="dob"
              value={state && state.dob ? state.dob : new Date()}
              onChange={pickDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
            <span
              className="d-flex flex-row justify-content-center align-items-center"
              style={{
                marginLeft: "30px",
                paddingLeft: "30px",
                borderLeft: "1px solid grey",
              }}
            >
              <FormControl className={classes.formControl}>
                <InputLabel id="gender-select">Gender</InputLabel>
                <Select
                  labelId="gender-select"
                  id="gender-select"
                  onChange={onChange}
                  value={state.gender}
                  name="gender"
                >
                  <MenuItem value="male">
                    Male <i className="fad fa-mars"></i>
                  </MenuItem>
                  <MenuItem value="female">
                    Female <i className="fad fa-venus"></i>
                  </MenuItem>
                  <MenuItem value="unknown">
                    Unknown <i className="fad fa-venus-mars"></i>
                  </MenuItem>
                </Select>
              </FormControl>
            </span>
            <span
              className="d-flex flex-row justify-content-center align-items-center"
              style={{
                marginLeft: "30px",
                paddingLeft: "30px",
                borderLeft: "1px solid grey",
              }}
            >
              <span>Update Avatar</span>
              <input
                accept="image/*"
                className={classes.input}
                name="avatar"
                onChange={pickFile}
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
                {src ? (
                  <img
                    src={src}
                    height="60px"
                    alt="preview"
                    width="60px"
                    style={{ borderRadius: "50%" }}
                  />
                ) : null}
              </label>
            </span>
          </Grid>
        </MuiPickersUtilsProvider>
        <TextField
          className={classes.textField}
          id="standard-required"
          label="Twitter"
          name="twitter"
          value={
            state.socials && state.socials.twitter ? state.socials.twitter : ""
          }
          type="url"
          style={{ width: "32%" }}
          disabled={attribute}
        />
        <TextField
          className={classes.textField}
          id="standard-required"
          label="Instagram"
          name="instagram"
          value={
            state.socials && state.socials.instagram
              ? state.socials.instagram
              : ""
          }
          type="url"
          style={{ width: "32%", marginLeft: "2%", marginRight: "2%" }}
          disabled={attribute}
        />
        <TextField
          className={classes.textField}
          id="standard-required"
          label="Facebook"
          name="facebook"
          value={
            state.socials && state.socials.facebook
              ? state.socials.facebook
              : ""
          }
          type="url"
          style={{ width: "32%" }}
          disabled={attribute}
        />
        <div className="w-100 d-flex justify-content-center align-items-center">
          <ColorButton
            variant="contained"
            color="primary"
            type="submit"
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
            Change Profile
          </ColorButton>
        </div>
      </div>
    </form>
  );
}
