import React, { useEffect, useState } from "react";
import AllOffered from "../components/AllOffered";
import "../styles/alloffered.css";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import AppNav from "../components/AppNav";
import AcceptedOffer from "../components/AcceptedOffer";

const AcceptedOffers = ({ ride, onClose }) => {
  useEffect(() => {
    document.body.classList.add("no-scroll");

    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  return (
    <div className="accepted-offers">
      <div className="accepted-offers-head">
        <h1 style={{ display: "inline-block", width: "fit-content" }}>
          Accepted Offers
        </h1>
        <button className="close-button" onClick={() => onClose()}>
          x
        </button>
      </div>

      <div
        className="accept-offer-card"
        style={{
          height: "max-content",
          overflow: "auto",
          wordWrap: "break-word",
          scrollbarWidth: "none",
          textAlign: "center",
        }}
      >
        {ride.acceptedOffers.length > 0 ? (
          ride.acceptedOffers.map((offer, index) => {
            return <AcceptedOffer key={index} offer={offer} />;
          })
        ) : (
          <h3>No Accepted Offers</h3>
        )}
      </div>
    </div>
  );
};

const AllOfferedRides = () => {
  const { user } = useUser();
  const [offeredRides, setOfferedRides] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showAcceptedOffers, setShowAcceptedOffers] = useState(false);
  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      axios
        .post("http://localhost:9000/getOfferedRides", {
          metaid: user.primaryWeb3Wallet.web3Wallet,
        })
        .then((res) => {
          setOfferedRides(res.data.offeredRides);
        });
    }
  }, [user]);
  const handleClickCard = (ride) => {
    setSelectedOffer(ride);
    setShowAcceptedOffers(true);
  };

  const handleOnClose = () => {
    setShowAcceptedOffers(false);
    setSelectedOffer(null);
  };
  return (
    <div>
      <AppNav />
      {offeredRides.length > 0 ? (
        <div>
          {offeredRides.map((ride, index) => {
            return (
              <AllOffered
                key={index}
                offeredRide={ride}
                handleClick={handleClickCard}
              />
            );
          })}
        </div>
      ) : (
        <h1>No Offered Rides</h1>
      )}
      {showAcceptedOffers && (
        <div className="overlay">
          <AcceptedOffers ride={selectedOffer} onClose={handleOnClose} />
        </div>
      )}
    </div>
  );
};

export default AllOfferedRides;
