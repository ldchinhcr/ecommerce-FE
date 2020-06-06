import React from "react";
import "../styles/paymentcard.css";
import Swal from 'sweetalert2/src/sweetalert2.js';
import payment from 'payment';
import "@sweetalert2/theme-wordpress-admin/wordpress-admin.min.css";

const alertMsgNotCorrectCard = {
  title: "Warning!!!",
  text: "Your card number is not correct, please try with other card numbers!",
  icon: "warning",
  showConfirmButton: false,
  iconHtml: '<i class="fad fa-exclamation-triangle"></i>',
  timer: 1500,
}
class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={`card ${this.props.processing ? "processing" : ""} ${
          this.props.complete ? "complete" : ""
        }`}
      >
        <div className={`back ${this.props.flipped ? "active" : ""}`}>
          <div className="decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="band"></div>
          <div className="cvc">
            {this.props.fields.cvc.length > 0 ? (
              <span>{this.props.fields.cvc}</span>
            ) : (
              <span className="default">123</span>
            )}
          </div>
        </div>
        <div className={`front ${this.props.flipped ? "" : "active"}`}>
          <div className="decoration">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="type">CREDIT CARD</div>
          <div className="chip">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="row-payment info">
            <div>
              <div className="row-payment number">
                {this.props.fields.number.length > 0 ? (
                  <span>{this.props.fields.number}</span>
                ) : (
                  <span className="default">0000 0000 0000 0000</span>
                )}
              </div>
              <div className="row-payment expiration">
                <div className="label-constant">VALID THRU</div>
                <div className="date">
                  {this.props.fields.month.length > 0 ? (
                    <span>{this.props.fields.month}</span>
                  ) : (
                    <span className="default">01</span>
                  )}
                  {this.props.fields.month.length > 0 &&
                  this.props.fields.year.length > 0 ? (
                    <span>/</span>
                  ) : (
                    <span className="default">/</span>
                  )}
                  {this.props.fields.year.length > 0 ? (
                    <span>{this.props.fields.year}</span>
                  ) : (
                    <span className="default">{(1900 + new Date().getYear()).toString().substring(2,4)*1}</span>
                  )}
                </div>
              </div>
              <div className="row-payment name">
                {this.props.fields.name.length > 0 ? (
                  <span>{this.props.fields.name}</span>
                ) : (
                  <span className="default">YOUR CC NAME</span>
                )}
              </div>
            </div>
            <div className="flag">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  flip(bool) {
    this.props.onFlip(bool);
  }

  handleSubmit(event) {
    document.activeElement.blur();
    event.preventDefault();

    this.props.onFormSubmit();
  }

  format(type, input, event) {
    let value = input.value.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    switch (type) {
      case "card-number":
        value = value.replace(/\D/g, "");
        input.value = value.replace(/([0-9]{4})\B/g, "$1 ");

        if (input.value != value) {
          setTimeout(
            () =>
              input.setSelectionRange(
                input.value.length + 1,
                input.value.length + 1
              ),
            0
          );
        }

        this.props.onFormInput( "number", input.value );
        break;

      case "card-name":
        input.value = value.replace(/\d*/g, "");
        this.props.onFormInput( "name", input.value );
        break;

      case "card-month":
        this.props.onFormInput( "month", input[input.selectedIndex].value);
        break;

      case "card-year":
        this.props.onFormInput( "year", input[input.selectedIndex].value );
        break;

      case "card-cvc":
        input.value = value.replace(/\D/g, "");
        this.props.onFormInput( "cvc", input.value );
        break;
    }
  }

  render() {
    return (
      <div>
        {!this.props.processing ? (
          <form
            ref={(form) => (this.form = form)}
            className="form-payment"
            onSubmit={this.handleSubmit.bind(this)}
          >
            <div className="details">
              <h1>Payment details</h1>
              <div className="group-payment">
                <label htmlFor="card-number">CARD NUMBER</label>
                <input
                  type="text"
                  id="card-number"
                  className="input-payment"
                  placeholder="0000 0000 0000 0000"
                  pattern="[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}"
                  maxLength="19"
                  ref={(input) => (this.cardNumber = input)}
                  onInput={(event) =>
                    this.format("card-number", this.cardNumber, event)
                  }
                  onFocus={() => this.flip(false)}
                  required
                />
              </div>
              <div className="group-payment">
                <label htmlFor="card-name">CARDHOLDER NAME</label>
                <input
                  id="card-name"
                  className="input-payment"
                  placeholder="YOUR FULL NAME ON CARDHOLDER"
                  ref={(input) => (this.cardName = input)}
                  onInput={(event) =>
                    this.format("card-name", this.cardName, event)
                  }
                  onFocus={() => this.flip(false)}
                  required
                />
              </div>
              <div className="row-payment">
                <div className="group-payment">
                  <label htmlFor="card-validity">VALID THROUGH</label>
                  <div className="validity">
                    <select
                      ref={(select) => (this.cardMonth = select)}
                      onChange={(event) =>
                        this.format("card-month", this.cardMonth, event)
                      }
                      onFocus={() => this.flip(false)}
                      className="select-payment"
                      required
                    >
                      <option defaultValue="" hidden>
                        Month
                      </option>
                      <optgroup label="Month">
                        {new Array(12).fill(1).map((el, index) => {
                          return (
                            <option
                              key={`month-${index}`}
                              value={`${
                                index + 1 < 10 ? `0${index + 1}` : index + 1
                              }`}
                            >
                              {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                    <select
                      ref={(select) => (this.cardYear = select)}
                      onChange={(event) =>
                        this.format("card-year", this.cardYear, event)
                      }
                      onFocus={() => this.flip(false)}
                      className="select-payment"
                      required
                    >
                      <option defaultValue="" hidden>
                        Year
                      </option>
                      <optgroup label="Year">
                        {new Array(12).fill(1).map((el, index) => {
                          return (
                            <option
                              key={`month-${
                                index +
                                parseInt(
                                  `${new Date().getFullYear()}`.slice(2, 4)
                                )
                              }`}
                              value={`${
                                index +
                                parseInt(
                                  `${new Date().getFullYear()}`.slice(2, 4)
                                )
                              }`}
                            >
                              {index +
                                parseInt(
                                  `${new Date().getFullYear()}`.slice(2, 4)
                                )}
                            </option>
                          );
                        })}
                      </optgroup>
                    </select>
                  </div>
                </div>
                <div className="group-payment">
                  <label className="label-payment" htmlFor="card-cvc">CVC</label>
                  <input
                    id="card-cvc"
                    placeholder="123"
                    className="input-payment"
                    pattern="[0-9]{3}"
                    maxLength="3"
                    ref={(input) => (this.cardCVV = input)}
                    onInput={(event) =>
                      this.format("card-cvc", this.cardCVV, event)
                    }
                    onFocus={() => this.flip(true)}
                    onBlur={() => this.flip(false)}
                    required
                  />
                </div>
              </div>
              <div className="group-payment">
                <button type="submit" className="button-payment">VALIDATE CARD</button>
              </div>
            </div>
          </form>
        ) : (
          <div className="payment">
            {!this.props.complete ? (
              <div className="trying">
                <h4>Validating your card...</h4>
                <div className="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <div>
                <div className="success">
                  <h4>Your card is valid!</h4>
                  <div className="check mt-3">
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

class Machine extends React.Component {
  render() {
    return (
      <div
        className={`machine ${this.props.processing ? "active" : ""} ${
          this.props.complete ? "complete" : ""
        }`}
      >
        <div className="body">
          <div className="visor">
            <div className="screen"></div>
          </div>
          <div className="keypad">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }
}

export default class PaymentForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flipped: false,
      processing: false
    };
  }

  populate(name, value) {
    this.props.setCardInfo({...this.props.cardInfo, [name]: value});
  }

  flip(bool) {
    this.setState({ flipped: bool });
  }

  process() {}

  render() {
    return (
    <main className="main-payment">
      <div className="container-payment">
        <div className="process">
          <Machine
            processing={this.state.processing}
            complete={this.props.validateCard}
          />
          <Card
            fields={this.props.cardInfo}
            flipped={this.state.flipped}
            processing={this.state.processing}
            complete={this.props.validateCard}
          />
        </div>
        <Form
          processing={this.state.processing}
          complete={this.props.validateCard}
          onFormSubmit={() => {
            this.setState({ processing: true });

            setTimeout(() => {
                // Validate before set it to completed or rejected
              const cardNumCheck = this.props.cardInfo.number.split(" ").join("");
              if (payment.fns.validateCardNumber(cardNumCheck)) {
              this.props.setValidateCard(true);
              this.props.setCardInfo({...this.props.cardInfo, number: this.props.cardInfo.number});
              } else {
                this.setState({ processing: false });
                Swal.fire(alertMsgNotCorrectCard);
              }

            }, 3000);
          }}
          onFormInput={this.populate.bind(this)}
          onFlip={this.flip.bind(this)}
        />
      </div>
      </main>
    );
  }
}
