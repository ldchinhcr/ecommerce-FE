import React, { useState } from "react";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Button from "../utils/Button.js";
import GridContainer from "../utils/GridContainer";
import GridItem from "../utils/GridItem";
import Parallax from "../utils/Parallax";
import anonymous from "../assets/img/anonymous.png";
import styles from "../utils/profilePage";
import { useSelector } from "react-redux";
import NavPills from "../utils/NavPills.js";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TimelineIcon from "@material-ui/icons/Timeline";
import ChangeProfile from "../components/ChangeProfile";
import ChangePassword from "../components/ChangePassword";
import Timeline from "../components/TimeLine";
import Fade from "react-reveal/Fade";
import UpdateProduct from "../components/UpdateProduct";
import UpdateDetailProduct from "../components/UpdateDetailProduct";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

const useStyles = makeStyles(styles);
export default function Profile(props) {
  const user = useSelector((state) => state.user);
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );

  const [openRoot, setOpenRoot] = useState(false);

  const [product, setProduct] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);

  const handleRootUpdate = (p) => {
    setProduct(p);
    setOpenRoot(true);
  };

  const handleDetailUpdate = (p) => {
    setProduct(p);
    setOpenDetails(true);
  };

  return (
    <Fade opposite>
      <div>
        <UpdateProduct
          show={openRoot}
          setOpenRoot={setOpenRoot}
          product={product}
          setProduct={setProduct}
          onHide={() => {
            setOpenRoot(false);
            setProduct(null);
          }}
        />
        <UpdateDetailProduct
          show={openDetails}
          setOpenDetails={setOpenDetails}
          product={product}
          setProduct={setProduct}
          onHide={() => {
            setOpenDetails(false);
            setProduct(null);
          }}
        />
        <Parallax
          small
          filter
          image={require("../assets/img/profile-bg.jpg")}
        />
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div>
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={6}>
                  <div className={classes.profile}>
                    <div>
                      <img
                        src={user && user.avatar ? user.avatar : anonymous}
                        alt={user.name}
                        className={imageClasses}
                      />
                    </div>
                    <div className={classes.name}>
                      <h3
                        className={
                          classes.title +
                          " d-flex h-100 align-items-center justify-content-center"
                        }
                      >
                        {user.name}
                        {!user.verified ? (
                          <ErrorOutlineIcon
                            style={{ color: "gray", marginLeft: "5px" }}
                          />
                        ) : (
                          <CheckCircleIcon
                            style={{ color: "green", marginLeft: "5px" }}
                          />
                        )}
                      </h3>
                      <div></div>
                      <a
                        href={user && user.socials && user.socials.twitter}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Button justIcon link className={classes.margin5}>
                          <i className={"fab fa-twitter"} />
                        </Button>
                      </a>
                      <a
                        href={user && user.socials && user.socials.instagram}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Button justIcon link className={classes.margin5}>
                          <i className={"fab fa-instagram"} />
                        </Button>
                      </a>
                      <a
                        href={user && user.socials && user.socials.facebook}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Button justIcon link className={classes.margin5}>
                          <i className={"fab fa-facebook"} />
                        </Button>
                      </a>
                    </div>
                  </div>
                </GridItem>
              </GridContainer>
              <GridContainer justify="center">
                <GridItem
                  xs={12}
                  sm={12}
                  md={12}
                  className={classes.navWrapper}
                >
                  <NavPills
                    alignCenter
                    color="gray"
                    tabs={[
                      {
                        tabButton: "My Profile",
                        tabIcon: AccountCircleIcon,
                        tabContent: (
                          <GridContainer justify="center">
                            <GridItem>
                              <ChangeProfile />
                            </GridItem>
                          </GridContainer>
                        ),
                      },
                      {
                        tabButton: "Password",
                        tabIcon: VisibilityIcon,
                        tabContent: (
                          <GridContainer justify="center">
                            <GridItem>
                              <ChangePassword />
                            </GridItem>
                          </GridContainer>
                        ),
                      },
                      {
                        tabButton: "Timeline",
                        tabIcon: TimelineIcon,
                        tabContent: (
                          <GridContainer justify="center">
                            <GridItem>
                              <Timeline
                                handleRootUpdate={handleRootUpdate}
                                handleDetailUpdate={handleDetailUpdate}
                              />
                            </GridItem>
                          </GridContainer>
                        ),
                      },
                    ]}
                  />
                </GridItem>
              </GridContainer>
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
