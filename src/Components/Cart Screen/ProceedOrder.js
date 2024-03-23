import React, { Component } from "react";
import {
  mapStateToProps,
  mapDispatchToProps,
} from "../../State Management/MappingStates";
import { connect } from "react-redux";
import loadingAnim from "../../animations/dataload.json";
import Lottie from "lottie-react";
import { FaCheckCircle } from "react-icons/fa";
import Currency from "../Item Screen/Currency";

class ProceedOrder extends Component {
  state = {
    userCart: {
      totalPrice: "",
      totalItem: 0,
    },
  };

  componentDidMount() {
    this.cartDetails();
  }

  cartDetails = () => {
    const { userCart } = this.props;
    let price = 0;
    let items = 0;
    userCart.forEach((cart) => {
      price += parseInt(cart.totalPrice);
      items += parseInt(cart.itemCount);
    });
    this.setState({
      userCart: {
        totalPrice: price,
        totalItem: items,
      },
    });
  };

  componentDidUpdate(prevProps, _) {
    if (prevProps.userCart !== this.props.userCart) {
      this.cartDetails();
    }
  }

  availabilityCheck = () => {
    const cart = this.props.userCart;
    const check = cart.some((i) => i.available === false);
    return check;
  };

  render() {
    const { totalItem, totalPrice } = this.state.userCart;
    const { proceedOrder, unavailable, proceedLoading } = this.props;
    return (
      <div className="confirm-order-container">
        <h2>Subtotal</h2>
        <div className="total-price">
          <Currency curr={totalPrice} />
        </div>
        <h3>
          Total items: <span>{totalItem}</span>
        </h3>
        <h4>
          {proceedLoading && (
            <Lottie animationData={loadingAnim} className="loading-anim" />
          )}
          <button
            className={proceedLoading ? "remove-btn-label" : ""}
            disabled={
              proceedLoading
                ? true
                : unavailable.length !== 0
                ? true
                : this.availabilityCheck()
                ? true
                : false
            }
            onClick={proceedOrder}
          >
            Proceed to Buy
          </button>
          {(unavailable.length !== 0 || this.availabilityCheck()) && (
            <span>
              Please remove the out-of-stock items or save them for later to
              continue.
            </span>
          )}
        </h4>
        <h5>
          <FaCheckCircle /> You are eligible for free delivery
        </h5>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProceedOrder);
