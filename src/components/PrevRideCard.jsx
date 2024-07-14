import React from "react";

const PrevRideCard = ({ ride }) => {
  return (
    <div className="prev-ride-card">
      <div className="prev-ride-usrdet">
        <div className="driver-name">
          <span>Driver Name:</span>
          <h4>{ride.drivername}</h4>
        </div>
        <div className="driver-contact">
          <span>Driver Contact:</span>
          <h4>+{ride.driverContact}</h4>
        </div>
        <div className="pickupdet">
          <span>Pickup:</span>
          <h4 className="hover-text">{ride.pickup.substr(0, 10) + "..."}</h4>
        </div>
        <div className="dropdet">
          <span>Drop:</span>
          <h4 className="hover-text">{ride.drop.substr(0, 10) + "..."}</h4>
        </div>
        <div className="amtpaid">
          <span>Paid:</span>
          <h4> ₹{ride.amountPaid}</h4>
        </div>
        <div className="driverCar">
          <span>Car number:</span>
          <h4>{ride.carNumber}</h4>
        </div>
      </div>
    </div>
  );
};

export default PrevRideCard;
