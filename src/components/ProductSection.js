import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import BarChartIcon from '@material-ui/icons/BarChart';
import FlareIcon from '@material-ui/icons/Flare';
// core components
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import InfoArea from "./InfoArea.js";
import BlurOnIcon from '@material-ui/icons/BlurOn';

import styles from "../utils/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Let{"'"}s talk product</h2>
          <h5 className={classes.description}>
            Lorem is not ipsum.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={3}>
            <InfoArea
              title="Safety Stuff"
              description="Made with high quality material with safety design."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
          <InfoArea
            title="Ideas"
            description="Larger, yet dramatically tougher to break. More powerful, but remarkably comfortable efficient."
            icon={BlurOnIcon}
            iconColor="warning"
            vertical
          />
        </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <InfoArea
              title="Statistics"
              description="Choose from a veriety of many colors resembling sugar paper pastels."
              icon={BarChartIcon}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={3}>
            <InfoArea
              title="Delightful design"
              description="Find unique and handmade delightful designs related items directly from our sellers."
              icon={FlareIcon}
              iconColor="danger"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
