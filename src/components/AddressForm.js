import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(0),
    width: '100%',
  },
}));

export default function AddressForm(props) {
  const classes = useStyles();

  const htmlCountry = props.dataListCountry.map((el,index) => {
    return (
      <MenuItem value={el.countryName} key={index} style={{width: '100%'}}>{el.countryName}</MenuItem>
    )
  })

  const htmlRegion = props.regionList.map((el,index) => {
    return (
      <MenuItem value={el.name} key={index} style={{width: '100%'}}>{el.name}</MenuItem>
    )
  })

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <form onChange={props.onChangeInfo}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              id="fullname"
              name="fullname"
              value={props.infoShipping.fullname}
              label="Full name"
              fullWidth
              autoComplete="full-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="address1"
              name="addressLine1"
              value={props.infoShipping.addressLine1}
              label="Address line 1"
              fullWidth
              autoComplete="shipping address-line1"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="address2"
              name="addressLine2"
              value={props.infoShipping.addressLine2}
              label="Address line 2"
              fullWidth
              autoComplete="shipping address-line2"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="telephone"
              name="telephone"
              value={props.infoShipping.telephone}
              required
              type="tel"
              inputProps={{
                min: 0,
                maxLength: "20",
                pattern: "[+]{1}[0-9]{11,14}",
              }}
              label="Phone Number"
              fullWidth
              autoComplete="telephone"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="city"
              value={props.infoShipping.city}
              name="city"
              label="City"
              fullWidth
              autoComplete="shipping address-level2"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              required
              id="zip"
              value={props.infoShipping.zipCode}
              type="number"
              name="zipCode"
              inputProps={{
                maxLength: 6
              }}
              label="Zip / Postal code"
              fullWidth
              autoComplete="shipping postal-code"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl className={classes.formControl}>
          <InputLabel id="country">Country</InputLabel>
          <Select
            labelId="country"
            id="country"
            name="country"
            value={props.infoShipping.country}
            onChange={props.onChangeInfo}
            autoWidth
          >
            {htmlCountry}
          </Select>
        </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
            <InputLabel id="region">State/Province/Region</InputLabel>
            <Select
              labelId="region"
              id="region"
              name="region"
              onChange={props.onChangeInfo}
              value={props.infoShipping.region}
              autoWidth
            >
              {htmlRegion}
            </Select>
          </FormControl>
            </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
