import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import checkToken from "../components/RefreshToken";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  listItem: {
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 700,
  },
  title: {
    marginTop: theme.spacing(2),
  },
  discount: {
    fontStyle: "italic",
  },
  shipping: {
    fontStyle: "italic",
  },
}));

export default function ReviewBill(props) {
  const classes = useStyles();
  const [currentCart, setCurrentCart] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(false);
  const history = useHistory();

  const getCurrentCart = async () => {
    await checkToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const responseJson = await fetch(
      process.env.REACT_APP_SERVER + "/cart/populated",
      options
    );
    const response = await responseJson.json();
    if (response.status === true) {
      if (response.data.products.length === 0) {
        deleteCartToBE();
      }
      setCurrentCart(response.data.products);
    }
  };

  const deleteCartToBE = async () => {
    await checkToken();
    const options = {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const response = await fetch(
      process.env.REACT_APP_SERVER + "/cart",
      options
    );
    if (response.status === 204) {
      console.log("Successfully deleted cart.");
    }
  };

  useEffect(() => {
    getCurrentCart().then(() => setForceUpdate(true));
  }, []);

  if (!forceUpdate) {
    return <div></div>;
  }

  if ((currentCart && currentCart.length === 0) || !currentCart) {
    return history.push("/explore");
  }

  const priceObj = calcPrice(currentCart);

  const payments = [
    { name: "Payment type", detail: "CC" },
    { name: "Card holder", detail: props.cardInfo.name },
    {
      name: "Card number",
      detail: `xxxx-xxxx-xxxx-${props.cardInfo.number.substring(
        props.cardInfo.number.length - 4,
        props.cardInfo.number.length
      )}`,
    },
    {
      name: "Expiry date",
      detail: props.cardInfo.month + "/" + props.cardInfo.year,
    },
  ];

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {currentCart.map((product) => (
          <ListItem className={classes.listItem} key={product.product.name}>
            <ListItemText
              primary={product.product.name}
              secondary={`Color: ${product.color.color}`}
            />
            <div className="d-flex flex-column">
              <Typography variant="body1">$ {product.product.price}</Typography>
              <Typography variant="body2">x {product.quantity}</Typography>
            </div>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText primary="Discount" secondary="" inset />
          <Typography variant="body1" className={classes.discount}>
            {" "}
            - $ {priceObj.discount}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Shipping" secondary="" inset />
          <Typography variant="body1" className={classes.shipping}>
            Free
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            $ {priceObj.total}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Shipping
          </Typography>
          <Typography gutterBottom>{props.infoShipping.fullname}</Typography>
          <Typography gutterBottom>
            Address: {props.infoShipping.addressLine1}
          </Typography>
          {props.infoShipping.addressLine2 ? (
            <Typography gutterBottom>
              {props.infoShipping.addressLine2}
            </Typography>
          ) : null}
          <Typography gutterBottom>{props.infoShipping.telephone}</Typography>
          <Typography gutterBottom>{`${props.infoShipping.city}${
            props.infoShipping.region
              ? ", " + props.infoShipping.region + ", "
              : ", "
          }${props.infoShipping.zipCode} ${
            props.infoShipping.country
          }`}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Payment details
          </Typography>
          <Grid container>
            {payments.map((payment) => (
              <React.Fragment key={payment.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const calcPrice = (products) => {
  const subTotal = products.reduce((total, product) => {
    return total + product.product.price * +product.quantity;
  }, 0);

  const discount = products.reduce((total, product) => {
    return (
      total +
      product.product.price *
        (product.product.priceDiscount / 100) *
        +product.quantity
    );
  }, 0);

  const total = subTotal - discount;

  return { subTotal, discount, total };
};
