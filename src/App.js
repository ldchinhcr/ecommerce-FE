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
import { useDispatch, useSelector } from "react-redux";
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
        window.history.pushState({}, document.title, window.location.pathname + window.location.search ? window.location.search : null);
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
    <div style={{height: '100vh'}}>
    <NavBar />
      <Scroller />
      <ScrollToTop>
        <Switch>
          <Route path="/" exact component={Homepage} />
          <AuthRoute path="/login" component={Login} />
          <AuthRoute path="/register" component={Register} />
          <AuthRoute path="/forgotpassword" component={ForgotPassword} />
          <Route path="/verifyaccount" component={VerifiedAccount} />
          <Route path="/resetpassword" component={ResetPassword} />
          <AuthExe path="/profile" component={Profile} />
          <AuthExe path="/addproduct" component={AddProduct} />
          <Route path="/cart" component={Cart} />
          <Route path="/explore" component={Shop} />
          <Route
            path="/category/:type/products/:product/:detail"
            component={ViewProduct}
          />
          <Route path="/category/:type" component={Category} />
          <AuthExe path="/checkout" component={CheckOut} />
          <Route path="*" component={NotFound} />
        </Switch>
      </ScrollToTop>
      <Footer />
    </div>
  );
}

export default App;
