import React from "react";
import "../styles/alloffered.css";
const AcceptedOffer = ({ offer }) => {
  return (
    <div className="accepted-offer-card">
      <div className="accepted-offer-usrdet">
        <div className="rider-name">
          <span>Rider Name:</span>
          <h4>{offer.username}</h4>
        </div>
        <div className="accepted-offer-pickupdet">
          <span>Pickup:</span>
          <h4 className="hover-text">{offer.usrsrc.toLowerCase().substr(0, 10) + "..."}</h4>
        </div>
        <div className="accepted-offer-dropdet">
          <span>Drop:</span>
          <h4 className="hover-text">{offer.usrdst.toLowerCase().substr(0, 10) + "..."}</h4>
        </div>
        <div className="accepted-offer-amtpaid">
          <span>Paid:</span>
          <h4> ₹{offer.offeredamt}</h4>
        </div>
        <div className="accepted-offer-passenger">
          <span>Passengers:</span>
          <h4>{offer.passengerCount}</h4>
        </div>
      </div>
    </div>
  );
};

export default AcceptedOffer;
