import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  List,
  ListItem,
  IconButton,
  Badge,
  Button,
  Snackbar,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import Header from "../utils/Header";
import styles from "../utils/navbarsStyle";
import CustomDropdown from "../utils/CustomDropdown.js";
import anonymous from "../assets/img/anonymous.png";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import MuiAlert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(styles);

const alertStyles = makeStyles((theme) => ({
  close: {
    padding: theme.spacing(0.5),
  },
  cart: {
    color: blueGrey[50],
    backgroundColor: blueGrey[500],
    "&:hover": {
      backgroundColor: blueGrey[700],
    }
  },
  buttonLeft: {
    textAlign: "center"
  }
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
  },
}))(Badge);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function NavBar() {
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const classes = useStyles();
  const alert = alertStyles();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(null);
  const [userSetSnackPack, setUserSetSnackPack] = useState(false);
  const [onload, setOnload] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const history = useHistory();

  const messageActive = () => {
    return (
      <Alert onClose={handleClose} severity="warning" color="info">
        Your account has not been activated yet, click this <Button onClick={handleVerify}>{onload ? <CircularProgress size={22}
        thickness={2}/> : "link"}</Button> to send new verification email.
      </Alert>
    );
  };

  const handleVerify = async () => {
    setOnload(true);
    const res = await fetch(process.env.REACT_APP_SERVER + "/users/generateverify", {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const resJson = await res.json();
    if (resJson.status === true) {
      setShow(true);
      setOnload(false);
    } else {
      setError(true);
      setOnload(false);
    }
  }

  const messageSuccessSent = () => {
    return (
      <Alert onClose={handleClose} severity="success">
      An message has been sent to your email address (valid for 60 mins).
      </Alert>
    );
  };

  const messageErrorSent = () => {
    return (
      <Alert onClose={handleClose} severity="error">
      Something went wrong, please try again later!.
      </Alert>
    );
  };

  useEffect(() => {
    const tokenUrl = window.location.href.split("?verifytoken=")[1]
    ? window.location.href.split("?verifytoken=")[1]
    : null;
    if (user && !user.verified && !userSetSnackPack && !tokenUrl) {
      setMsg(messageActive());
      setOpen(true);
      setUserSetSnackPack(true);
    } else if (user && !user.verified && show) {
      setMsg(messageSuccessSent());
      setOpen(true);
      setShow(false);
    } else if (user && !user.verified && error) {
      setMsg(messageErrorSent());
      setOpen(true);
      setError(false);
    }
  },[user, userSetSnackPack, show])

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setUserSetSnackPack(true);
    setShow(false);
  };

  const handleCart = () => {
    if (cart.length === 0) {
      return 0;
    }
    let total = cart.reduce((sum, p) => {
      sum += p.quantity;
      return sum
    },0)
    return total;
  }

  return (
    <span>
      <div className={alert.root}>
        <Snackbar
          open={open}
          autoHideDuration={8000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {msg}
        </Snackbar>
      </div>
      <Header
        brand="Distance Traveler"
        color="white"
        changeColorOnScroll={{
          height: 150,
          color: "dark",
        }}
        fixed
        leftLinks={
          <List className={classes.list}>
            <ListItem className={classes.listItem + " " + alert.buttonLeft}>
            <Button className={classes.navLinkActive} onClick={()=> history.push('/explore')}>
                Explore
          </Button>
            </ListItem>
          </List>
        }
        rightLinks={
          <List className={classes.list}>
            <ListItem className={classes.listItem}>
              <CustomDropdown
                left
                caret={false}
                hoverColor="black"
                buttonText={
                  <img
                    src={user && user.avatar ? user.avatar : anonymous}
                    className={classes.img}
                    alt="profile"
                  />
                }
                className={classes.notificationNavLink}
                buttonProps={{
                  className: classes.navLink,
                  color: "transparent",
                }}
                dropdownList={
                  !user ? ["Login", "Register"] : ["Profile", "Add Product", "Logout"]
                }
              />
            </ListItem>
            <ListItem className={classes.listItem}>
              <IconButton aria-label="cart" className={classes.navLink} onClick={() => history.push('/cart')}>
                <StyledBadge badgeContent={handleCart()} color="secondary">
                  <span className="cart-bg">
                    <ShoppingCartOutlinedIcon className={alertStyles.cart}/>
                  </span>
                </StyledBadge>
              </IconButton>
            </ListItem>
          </List>
        }
      />
    </span>
  );
}
