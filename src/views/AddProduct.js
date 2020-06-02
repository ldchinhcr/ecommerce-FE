import React from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import NewBaseProduct from "../components/NewBaseProduct";
import NewDetailProduct from "../components/NewDetailProduct";
import Parallax from "../utils/Parallax";
import classNames from "classnames";
import styles from "../utils/profilePage";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import Fade from 'react-reveal/Fade';

const baseStyles = makeStyles(styles);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(3),
  },
}));

export default function AddProduct() {
  const baseClasses = baseStyles();
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return (
    <Fade opposite>
    <div>
      <Parallax small filter image={require("../assets/img/profile-bg.jpg")} />
      <div className={classNames(baseClasses.main, baseClasses.mainRaised)}>
        <div>
          <div className={baseClasses.container}>
            <GridContainer justify="center">
              <GridItem>
                <div className={baseClasses.profile}>
                  <div className={classes.root}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                        aria-label="full width tabs example"
                      >
                        <Tab
                          label="Add New Product"
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Add more details for the Added Product"
                          {...a11yProps(1)}
                        />
                      </Tabs>
                    </AppBar>
                    <SwipeableViews
                      axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                      index={value}
                      onChangeIndex={handleChangeIndex}
                    >
                      <TabPanel value={value} index={0} dir={theme.direction}>
                        <NewBaseProduct />
                      </TabPanel>
                      <TabPanel value={value} index={1} dir={theme.direction}>
                        <NewDetailProduct/>
                      </TabPanel>
                    </SwipeableViews>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
    </Fade>
  );
}
