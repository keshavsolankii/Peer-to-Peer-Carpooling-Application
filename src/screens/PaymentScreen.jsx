import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";

function PaymentScreen() {
  const location = useLocation();

  const Rate = [
    {
      cost: parseInt(
        location.state.acceptedamt / location.state.passengerCount
      ),
      fname: location.state.drivername,
      qnty: location.state.passengerCount,
      driverid: location.state.driverid,
      userid: location.state.userid,
      passengerCount: location.state.passengerCount,
      pickup: location.state.pickup,
      drop: location.state.drop,
      drivercontact: location.state.drivercontact,
    },
  ];
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51PAHO2SHVRpWe0M6ia9b4HZE4kYLWe60QHxMIBW0ft6a9oifxHNIjF2HyJFUcYC6bh8ogcRGnN6isloiLjFnNi3v00YQ2F2vtV"
    );

    const body = {
      prices: Rate,
    };

    const headers = {
      "Content-type": "application/json",
    };
    const response = await fetch(
      "http://localhost:7000/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };
  return (
    <div>
      <input
        type="text"
        name="name"
        id="name"
        placeholder="Reciepent Name"
        className="ip"
        defaultValue={location.state.drivername}
      />
      <button onClick={makePayment} className="submitBtn">
        Make Payment
      </button>
    </div>
  );
}

export default PaymentScreen;
