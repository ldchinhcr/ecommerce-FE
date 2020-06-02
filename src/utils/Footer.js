/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { List, ListItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import pay1 from '../assets/img/payment/icon-pay-01.png';
import pay2 from '../assets/img/payment/icon-pay-02.png';
import pay3 from '../assets/img/payment/icon-pay-03.png';
import pay4 from '../assets/img/payment/icon-pay-04.png';
import pay5 from '../assets/img/payment/icon-pay-05.png';

import styles from "./footerStyle.js";

const useStyles = makeStyles(styles);

export default function Footer(props) {
  const classes = useStyles();
  const { whiteFont } = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
      <div className={classes.container}>
        <div className={classes.left}>
          <List className={classes.list}>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                target="_blank"
              >
                Brand
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                target="_blank"
              >
                About us
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                target="_blank"
              >
                Blog
              </a>
            </ListItem>
            <ListItem className={classes.inlineBlock}>
              <a
                className={classes.block}
                target="_blank"
              >
                Licenses
              </a>
            </ListItem>
          </List>
        </div>
        <div className={classes.right} style={{alignItems: 'center', }}>
          &copy; {1900 + new Date().getYear()} - {" "} Accepted with {" "}
          <img src={pay1} className={aClasses}/>{" "}
          <img src={pay2} className={aClasses}/>{" "}
          <img src={pay3} className={aClasses}/>{" "}
          <img src={pay4} className={aClasses}/>{" "}
          <img src={pay5} className={aClasses}/>{" "}
        </div>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  whiteFont: PropTypes.bool
};
