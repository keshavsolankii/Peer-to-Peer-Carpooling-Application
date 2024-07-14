import React from "react";

const RideCard = (props) => {
  const rideObj = props.rideObj;
  return (
    <div
      className="ride-card"
      onClick={() => {
        props.handleRideClick(rideObj);
      }}
      data-aos="flip-down"
    >
      <div className="ride-card-header">
        <div
          className="ride-location-details"
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            fontFamily: "poppins",
          }}
        >
          <div className="ride-card-from">
            {rideObj.source.length > 10
              ? rideObj.source.substring(0, 10)+'...'
              : rideObj.source}
          </div>
          <span>{"->"}</span>
          <div className="ride-card-dest">{rideObj.dest.length > 10
              ? rideObj.dest.substring(0, 10)+'...'
              : rideObj.dest}</div>
        </div>
        <div
          className="ride-seat-info"
          style={{ fontFamily: "nunito-sans-normal" }}
        >
          <div className="ride-card-available-seats">
            Vacant seats: {rideObj.availableSeats} |
          </div>
          <div className="ride-card-total-seats">
            Total seats: {rideObj.totalSeats}
          </div>
        </div>
      </div>
      <div
        className="ride-card-body"
        style={{ fontFamily: "nunito-sans-normal" }}
      >
        <div className="ride-card-name">Driver's name: {rideObj.driver}</div>
        <div className="ride-card-phone">
          Driver's contact: {rideObj.contact}
        </div>
        <div className="ride-card-time">Time: {rideObj.time}hr</div>
        <div className="ride-card-carname">Car: {rideObj.carName}</div>
        <div className="ride-card-carnumber">
          Car Number: {rideObj.carNumber}
        </div>
      </div>
    </div>
  );
};

export default RideCard;
