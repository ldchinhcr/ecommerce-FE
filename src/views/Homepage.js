import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import Parallax from "../utils/Parallax";
import styles from "../utils/landingPage";
import stylesProfile from "../utils/profilePage";
import pic1 from "../assets/img/lg-hp1.webp";
import pic2 from "../assets/img/lg-hp2.webp";
import pic3 from "../assets/img/lg-hp3.webp";
import pic4 from "../assets/img/lg-hp4.webp";
import suitcase from "../assets/img/suitcase-hp.png";
import bag from "../assets/img/bag-hp.png";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SwiperCorousel from "../components/SwiperCorousel";
import ProductSection from "../components/ProductSection";
import { Typography, Box } from "@material-ui/core";
import PropTypes from "prop-types";
import Fade from "react-reveal/Fade";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "@material-ui/core";
import { TabContext } from "@material-ui/lab";

const useStyles = makeStyles(styles);
const useStylesProfile = makeStyles(stylesProfile);

const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 40,
      width: "100%",
      backgroundColor: "#635ee7",
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: "none",
    color: "#000",
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    transition: "all 0.3s",
    "&:focus": {
      opacity: 1,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const tabsStyle = makeStyles((theme) => ({
  tabs: {
    marginTop: "30px",
    flexGrow: 1,
    width: "100%",
    height: "100%",
  },
  padding: {
    padding: theme.spacing(1),
  },
  demo2: {
    backgroundColor: "#fff",
  },
  tabPanel: {
    color: "#000",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tabCorousel: {
    color: "#000",
    width: "100%",
    height: "100%",
  },
}));

const textStyle = makeStyles((theme) => ({
  root: {
    margin: "70px 0",
  },
  text1: {
    fontFamily: "'Courier New', Courier, monospace",
  },
  text2: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
  },
  text3: {
    fontFamily: "'Roboto', sans-serif",
  },
  text4: {
    fontFamily: "'Playfair Display', serif",
  },
  img: {
    "@media (min-width: 576px)": {
      width: "140px",
    },
    "@media (min-width: 768px)": {
      width: "150px",
    },
    "@media (min-width: 992px)": {
      width: "180px",
    },
    "@media (min-width: 1200px)": {
      width: "200px",
    },
    "@media (min-width: 1500px)": {
      width: "250px",
    },
    "@media (min-width: 1800px)": {
      width: "400px",
    },
    "@media (min-width: 2440px)": {
      width: "600px",
    },
  },
}));

const containerStyle = makeStyles((theme) => ({
  container: {
    "@media (min-width: 1500px)": {
      maxWidth: "1440px",
    },
    "@media (min-width: 1800px)": {
      maxWidth: "1740px",
    },
    "@media (min-width: 2440px)": {
      maxWidth: "2400px",
    },
  },
}));

export default function Homepage() {
  const classes = useStyles();
  const classesProfile = useStylesProfile();
  const classesTabs = tabsStyle();
  const navImageClasses = classNames(
    classesProfile.imgRounded,
    classesProfile.imgGallery
  );
  const styleForContainerTabs = containerStyle();
  const [value, setValue] = useState(0);

  const styleTextContent = textStyle();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
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
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Fade opposite>
      <div className="body-content">
        <Parallax filter image={require("../assets/img/hp-bg.jpg")}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <Fade top delay={500}>
                  <h1 className={classes.title}>Your Story Starts With Us.</h1>
                </Fade>
                <Fade bottom delay={1500}>
                  <h4>Hello there</h4>
                </Fade>
                <br />
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div
            className={
              classes.container + " " + styleForContainerTabs.container
            }
          >
            <GridContainer className={classesProfile.navWrapper}>
              <GridItem xs={12} sm={12} md={5}>
                <GridContainer
                  className={classesProfile.navWrapper}
                  style={{ marginTop: "60px" }}
                >
                  <GridItem xs={12} sm={12} md={6}>
                    <img src={pic1} className={navImageClasses} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <img src={pic2} className={navImageClasses} />
                  </GridItem>
                </GridContainer>
                <GridContainer className={classesProfile.navWrapper}>
                  <GridItem xs={12} sm={12} md={6}>
                    <img src={pic3} className={navImageClasses} />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    <img src={pic4} className={navImageClasses} />
                  </GridItem>
                </GridContainer>
              </GridItem>
              <GridItem xs={12} sm={12} md={7}>
                <GridContainer
                  className={classesProfile.navWrapper}
                  style={{ height: "inherit" }}
                >
                  <GridItem className="h-100">
                    <div className={classesTabs.tabs + " " + navImageClasses}>
                      <div className={classesTabs.demo2}>
                        <TabContext value={value.toString()}>
                          <StyledTabs
                            value={value}
                            onChange={handleChange}
                            aria-label="styled tabs"
                          >
                            <StyledTab label="Discover" {...a11yProps(0)} />
                            <StyledTab
                              label="Modern Travel"
                              {...a11yProps(1)}
                            />
                            <StyledTab label="Link Travel" {...a11yProps(2)} />
                          </StyledTabs>
                          <TabPanel
                            className={classesTabs.tabPanel}
                            value={value}
                            index={0}
                          >
                            <h4
                              className={
                                styleTextContent.text1 +
                                " " +
                                styleTextContent.root
                              }
                              style={{ marginTop: "20px" }}
                            >
                              MIX & MATCH
                            </h4>
                            <h1
                              className={
                                styleTextContent.text4 +
                                " " +
                                styleTextContent.root
                              }
                            >
                              Build your travel uniform
                            </h1>
                            <GridContainer
                              className={classesProfile.navWrapper}
                              style={{ marginTop: "20px" }}
                            >
                              <GridItem xs={12} sm={12} md={6}>
                                <img
                                  src={suitcase}
                                  className={styleTextContent.img}
                                />
                                <Link to="/category/suitcase">
                                  <h5 className="item-hp">
                                    SUITCASE{" "}
                                    <ArrowForwardIcon className="icon-arrow-hp" />
                                  </h5>
                                </Link>
                              </GridItem>
                              <GridItem xs={12} sm={12} md={6}>
                                <Link to="/category/bag">
                                  <img
                                    src={bag}
                                    className={styleTextContent.img}
                                  />
                                  <h5 className="item-hp">
                                    BAG{" "}
                                    <ArrowForwardIcon className="icon-arrow-hp" />
                                  </h5>
                                </Link>
                              </GridItem>
                            </GridContainer>
                          </TabPanel>
                          <TabPanel
                            className={classesTabs.tabPanel}
                            value={value}
                            index={1}
                          >
                            <h5
                              className={
                                styleTextContent.text1 +
                                " " +
                                styleTextContent.root
                              }
                            >
                              ON THE (SOCIAL) GRID
                            </h5>

                            <h3
                              className={
                                styleTextContent.text2 +
                                " " +
                                styleTextContent.root
                              }
                            >
                              #modernTravel
                            </h3>

                            <h4
                              className={
                                styleTextContent.text3 +
                                " " +
                                styleTextContent.root
                              }
                            >
                              You’ll love our products. But don’t take our word
                              for it—here’s how your fellow travelers get Away.
                            </h4>
                          </TabPanel>
                          <TabPanel value={value} index={2}>
                            <h2
                              className={
                                styleTextContent.text1 +
                                " text-dark " +
                                styleTextContent.root
                              }
                            >
                              Link up
                            </h2>
                            <h4
                              className={
                                styleTextContent.text3 +
                                " text-dark " +
                                styleTextContent.root
                              }
                            >
                              Attach your personal item to your Carry-On when
                              youre in transit to take on the world, then slide
                              it off of your suitcase and take it with you to
                              explore your surroundings.
                            </h4>
                          </TabPanel>
                        </TabContext>
                      </div>
                    </div>
                  </GridItem>
                </GridContainer>
              </GridItem>
            </GridContainer>
            <ProductSection />
            <GridContainer className="mx-2">
              <GridItem>
                <div className="w-100 text-center text-muted mt-3">
                  <p
                    style={{
                      fontSize: "46px",
                      fontStyle: "italic",
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    Trending Choices
                  </p>
                </div>
                <SwiperCorousel />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </Fade>
  );
}
