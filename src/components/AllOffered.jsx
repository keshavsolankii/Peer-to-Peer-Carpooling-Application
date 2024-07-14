import React from "react";

const AllOffered = ({ offeredRide, handleClick }) => {
  return (
    <div
      className="alloffered-card"
      onClick={() => {
        handleClick(offeredRide);
      }}
    >
      <div className="ride-details">
        <div className="pickupdet">
          <span>Source:</span>
          <h4 className="hover-text">
            {offeredRide.source.length > 10
              ? offeredRide.source.substr(0, 10) + "..."
              : offeredRide.source}
          </h4>
        </div>
        <div className="dropdet">
          <span>Destination:</span>
          <h4 className="hover-text">
            {offeredRide.dest.length > 10
              ? offeredRide.dest.substr(0, 10) + "..."
              : offeredRide.dest}
          </h4>
        </div>
        <div className="seats-booked">
          <span>Seats Booked:</span>
          <h4>{offeredRide.seatsBooked}</h4>
        </div>
        <div className="earning">
          <span>Earnings:</span>
          <h4>₹{offeredRide.totalEarning}</h4>
        </div>
        <div className="time">
          <span>Time:</span>
          <h4>{offeredRide.time}</h4>
        </div>
        <div className="driverCar">
          <span>Car number:</span>
          <h4>{offeredRide.carNumber}</h4>
        </div>
      </div>
    </div>
  );
};

export default AllOffered;
