import React from "react";
import "../styles/offercard.css";

const OffersCard = ({ offer, handleClick }) => {
  // console.log(offer);
  const handleCardClick = () => {
    if (!offer.accepted) {
      handleClick(offer);
    }
  };
  return (
    <div
      className={`offer-card ${offer.accepted ? "offer-card-accepted" : ""}`}
      onClick={handleCardClick}
      data-aos="zoom-in-up"
    >
      <div className="offer-card-header">
        <div className="offer-card-username">
          <span>Rider: </span>
          {offer.username}
        </div>
        <div className="offer-card-contact">
          <span>Contact: </span>
          {offer.contact}
        </div>
        <div className="offer-status">
          <span>Status: </span>
          {offer.accepted ? "Accepted" : "Pending"}
        </div>
      </div>
      <div className="offer-card-body">
        <div className="offer-card-offeredamt">
          Offered amount: {offer.offeredamt}
        </div>
        <div className="offer-card-usrsrc">
          Source:{" "}
          {offer.usrsrc.length > 40
            ? offer.usrsrc.substr(0, 40) + "..."
            : offer.usrsrc}
        </div>
        <div className="offer-card-usrdst">
          Destination:{" "}
          {offer.usrdst.length > 40
            ? offer.usrdst.substr(0, 40) + "..."
            : offer.usrdst}
        </div>
        <div className="offer-card-passengerCount">
          Passenger Count: {offer.passengerCount}
        </div>
      </div>
    </div>
  );
};

export default OffersCard;
