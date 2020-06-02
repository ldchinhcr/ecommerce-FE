import React, { useState, useEffect } from 'react';
import Fade from 'react-reveal/Fade';
import {useSelector, useDispatch} from 'react-redux';
import checkToken from "../components/RefreshToken";
import rally from '../assets/img/color/rally.png';
import "../styles/cart.css";
import { Button } from '@material-ui/core';
import {useHistory} from "react-router-dom";
import Swal from "sweetalert2";

export default function Cart() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [currentCart, setCurrentCart] = useState(useSelector(state => state.cart));
    const [currentCartPopulated, setCurrentCartPopulated] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(false);
    const history = useHistory();

    const alertMsgOverAvailable = {
      title: "Warning!!!",
      text: "You have provide quantity exceeds available products or this product has been unavailable for sale!",
      icon: "warning",
      showConfirmButton: false,
      timer: 1500,
    }

    const getCurrentCart = async() => {
        await checkToken();
        const options = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        }
        const responseJson = await fetch(process.env.REACT_APP_SERVER + '/cart/populated', options);
        const response = await responseJson.json();
        if (response.status === true) {
            if (response.data.products.length === 0) {
              deleteCartToBE()
            }
            setCurrentCartPopulated(response.data.products);
        }
    }

    const deleteCartToBE = async() => {
      await checkToken();
      const options = {
          method: 'DELETE',
          headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token')
          }
      }
      const response = await fetch(process.env.REACT_APP_SERVER + '/cart', options);
      if (response.status === 204) {
        dispatch({type: "UPDATE_CART", payload: []});
        console.log('Successfully deleted cart.')
      }
    };

    useEffect(()=> {
      getCurrentCart().then(()=> setForceUpdate(true));
    },[]);

    const onChangeProductQuantity = async(index, event) => {
        const products = currentCart;
        const value = event.target.value;
        const valueInt = parseInt(value);

        if (value === "") {
          products[index].quantity = value;
        } else if (valueInt > 0 && valueInt < 100) {
          products[index].quantity = valueInt;
        }

        await sendUpdateCartToBE(products[index]);
        await getCurrentCart();
      };

    const onRemoveProduct = async(i) => {
        const products = currentCart.filter((product, index) => {
          return index != i;
        });
        await sendDeleteProductToBE({products: products});
        await getCurrentCart();
      };

      const sendDeleteProductToBE = async (data) => {
        await checkToken();
        const response = await fetch(process.env.REACT_APP_SERVER + "/cart/delproducts", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        const responseJson = await response.json();
        if (responseJson.status === true) {
          dispatch({ type: "UPDATE_CART", payload: responseJson.data.products });
          setCurrentCart(responseJson.data.products);
        }
      };

    const sendUpdateCartToBE = async (data) => {
        await checkToken();
        const response = await fetch(process.env.REACT_APP_SERVER + "/cart", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(data),
        });
        const responseJson = await response.json();
        if (responseJson.status === true) {
          dispatch({ type: "UPDATE_CART", payload: responseJson.data.products });
          setCurrentCart(responseJson.data.products);
        } else if (responseJson.message === "Over Availability") {
          Swal.fire(alertMsgOverAvailable);
        }
      };

    if (!forceUpdate) {
      return <div></div>
    }

    return (
        <Fade opposite>
            <div className="text-dark d-flex flex-column justify-content-center align-items-center mt-5">
              <Header products={currentCartPopulated} />
              {user && currentCartPopulated.length > 0 ? (
                <div>
                  <ProductList
                    products={currentCartPopulated}
                    onChangeProductQuantity={onChangeProductQuantity}
                    onRemoveProduct={onRemoveProduct}
                  />
                  <Summary
                    products={currentCartPopulated}
                    history={history}
                  />
                </div>
              ) : ( user ?
                <div className="empty-product">
                  <h3>There are no products in your cart.</h3>
                  <Button className="img-cart" variant="contained" onClick={() => history.push("/explore")}>Shopping now</Button>
                </div> : <div className="empty-product">
                <h3>You''re currently not logged in.</h3>
                <Button className="img-cart" variant="contained" onClick={() => history.push("/login")}>Log In</Button>
              </div>
              )}
            </div>
        </Fade>
    )
}

function Header(props) {
    const itemCount = props.products.reduce((quantity, product) => {
      return quantity + +product.quantity;
    }, 0);

    return (
      <header className="container mt-5 header-class">
        <h1>Shopping Cart</h1>

        <span className="count-cart">{itemCount} items in your cart!</span>
      </header>
    );
  }

  function ProductList(props) {
    const onClickProduct = async(t,p,c) => {
        window.open(`${window.location.origin}/category/${t}/products/${p}/${c}`, "_blank");
    };

    return (
      <div className="container-cart">
        <ul className="products-cart">
          {props.products.map((product, index) => {
            return (
              <li className="row-cart" key={index}>
                <div className="col-cart left">
                  <div className="thumbnail">
                      <img className="img-cart" src={product.color.images[0]} alt={product.product.name} />
                  </div>
                  <div className="detail-cart">
                    <div className="name" onClick={() => onClickProduct(product.product.type.slug, product.product.slug, product.color.slug)} style={{cursor: 'pointer'}}>
                      {product.product.name}
                    </div>
                    <div className="description">Color: {product.color.color === 'rally' ? <span><img className="color-icon ml-1" src={rally}/></span> : <span className="color-icon ml-1" style={{backgroundColor: product.color.color}}></span>}</div>
                    <div className="price">{formatCurrency(product.product.price)}</div>
                  </div>
                </div>
  
                <div className="col-cart right">
                  <div className="quantity-cart">
                  <input
                    type='number'
                    className="quantity-cart input-cart"
                    value={product.quantity}
                    onChange={props.onChangeProductQuantity.bind(this, index)}
                   />
                  </div>
  
                  <div className="remove">
                    <svg
                      onClick={props.onRemoveProduct.bind(this,index)}
                      version="1.1"
                      className="close"
                      x="0px"
                      y="0px"
                      viewBox="0 0 60 60"
                      enableBackground="new 0 0 60 60"
                    >
                      <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812" />
                    </svg>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  
  function Summary(props) {
    const subTotal = props.products.reduce((total, product) => {
        return total + product.product.price * +product.quantity;
      }, 0);
    const discount = props.products.reduce((total, product) => {
      return total + product.product.price * (product.product.priceDiscount/100) * +product.quantity;
    }, 0);

    const total = subTotal - discount;
  
    return (
      <div className="container-cart">
  
        <div className="summary w-100">
          <ul>
            <li>
              Subtotal <span>{formatCurrency(subTotal)}</span>
            </li>
            {discount > 0 && (
              <li>
                Discount <span>{formatCurrency(discount)}</span>
              </li>
            )}
            <li className="total">
              Total <span>{formatCurrency(total)}</span>
            </li>
            {total*1 > 999999 && (
              <li>
                <p className="text-danger">Your transaction amount is over our limit 999,999.99 $, please consider to change the quantity!!!</p>
              </li>
            )}
          </ul>
        </div>
  
        <div className="checkout">
          <Button className="button-cart" variant="outlined" type="button" onClick={() => props.history.push("/checkout")} disabled={total*1 > 999999 ? true : false}>Check Out</Button>
        </div>
      </div>
    );
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD"
    });
}
