import React, { useEffect, useState, useCallback } from "react";
import "./styles/style.min.css";
import { Switch, Route } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import AuthExe from "./components/AuthExe";
import NavBar from "./components/Navbar";
import Homepage from "./views/Homepage";
import Login from "./views/Login";
import Profile from "./views/Profile";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import VerifiedAccount from "./views/VerifiedAccount";
import AddProduct from "./views/AddProduct";
import Register from "./views/Register";
import { useDispatch } from "react-redux";
import NotFound from "./views/NotFound";
import Shop from "./views/Shop";
import Category from "./views/Category";
import ViewProduct from "./views/ViewProduct";
import Cart from "./views/Cart";
import Scroller from "./utils/Scroller";
import Footer from "./utils/Footer";
import ScrollToTop from "react-router-scroll-top";
import getCart from "./components/Cart";
import CheckOut from "./views/CheckOut";
import RouteNavOps1 from './components/RouteNavOps1';
import RouteNavOps2 from './components/RouteNavOps2';

function App() {
  const dispatch = useDispatch();
  const [runUseEffect, setRunUseEffect] = useState(false);
  useEffect(() => {
    checkUser().then(() => setRunUseEffect(true));
  }, []);
  const checkUser = async () => {
    const hashedTokenUrl = window.location.href.split("?token=")[1]
      ? window.location.href.split("?token=")[1]
      : null;
    let localaccesstoken = localStorage.getItem("token");
    let localrefreshtoken = localStorage.getItem("refreshToken");
    const queryToken = hashedTokenUrl || localaccesstoken || localrefreshtoken;
    if (!queryToken) return;
    const accessTokenUrl = hashedTokenUrl
      ? hashedTokenUrl.split("&&refreshToken=")[0]
      : null;
    const hashedRefreshToken = hashedTokenUrl
      ? hashedTokenUrl.split("&&refreshToken=")[1]
      : null;
    const refreshTokenUrl =
      hashedRefreshToken && hashedRefreshToken.split("#")[0];
    if (refreshTokenUrl) {
      localStorage.setItem("refreshToken", refreshTokenUrl);
    }
    const accessToken = localaccesstoken || accessTokenUrl;
    const refreshToken = localrefreshtoken || refreshTokenUrl;
    if (accessToken || refreshToken) {
      const resJson = await fetch(process.env.REACT_APP_SERVER + "/users/me", {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      const res = await resJson.json();
      if (res && res.status === true) {
        localStorage.setItem("token", accessToken);
        dispatch({ type: "SET_USER", payload: res.data });
        if (hashedTokenUrl) {
          window.history.pushState({}, document.title, window.location.pathname);
        } else {
          window.history.pushState({}, document.title, window.location.pathname + window.location.search ? window.location.search : null);
        }
        const cart = await getCart();
        if (cart) {
          dispatch({ type: "UPDATE_CART", payload: cart.products });
        }
      } else {
        if (refreshToken) {
          const response = await fetch(
            process.env.REACT_APP_SERVER + "/auth/refresh-token",
            {
              method: "POST",
              headers: {
                authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ refreshToken: refreshToken }),
            }
          );
          const data = await response.json();
          if (data.status === true) {
            localStorage.setItem("token", data.token);
            checkUser();
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
          }
        } else {
          localStorage.removeItem("token");
        }
      }
    }
  };

  if (!runUseEffect) {
    return (
      <div>
        <Switch>
          <Route path="/" render={() => <div />} />
        </Switch>
      </div>
    );
  }

  return (
    <div>
    <ScrollToTop>
    <Scroller />
        <Switch>
          <RouteNavOps1 path="/" exact component={Homepage} />
          <RouteNavOps1 path="/login" component={AuthRoute} mainPage={Login}/>
          <RouteNavOps1 path="/register" component={AuthRoute} mainPage={Register}/>
          <RouteNavOps1 path="/forgotpassword" component={AuthRoute} mainPage={ForgotPassword}/>
          <RouteNavOps1 path="/verifyaccount" component={Route} mainPage={VerifiedAccount}/>
          <RouteNavOps1 path="/resetpassword" component={Route} mainPage={ResetPassword}/>
          <RouteNavOps1 path="/profile" component={AuthExe} mainPage={Profile}/>
          <RouteNavOps1 path="/addproduct" component={AuthExe} mainPage={AddProduct}/>
          <RouteNavOps2 path="/cart" component={Route} mainPage={Cart}/>
          <RouteNavOps1 path="/explore" component={Route} mainPage={Shop}/>
          <RouteNavOps2 path="/category/:type/products/:product/:detail" component={Route} mainPage={ViewProduct}/>
          <RouteNavOps1 path="/category/:type" component={Route} mainPage={Category}/>
          <RouteNavOps2 path="/checkout" component={AuthExe} mainPage={CheckOut}/>
          <Route path="*" component={NotFound} />
        </Switch>
        <Footer />
        </ScrollToTop>
    </div>
  );
}

export default App;
