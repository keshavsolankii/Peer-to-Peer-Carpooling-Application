import React, { useEffect, useState } from "react";
import axios from "axios";
import OffersCard from "../components/OffersCard";
import { useUser } from "@clerk/clerk-react";
import AppNav from "../components/AppNav";
import io from "socket.io-client";
import "../styles/offercard.css";

const socket = io.connect("http://localhost:9001");
const NegotiationForm = ({ onClose, offer, onNegotiate, onAccept }) => {
  const [negotiateAmt, setNegotiateAmt] = useState(offer.offeredamt);
  const maxNegotiateAmtPercentage = 70;
  const maxNegotiateAmount =
    offer.offeredamt * (1 + maxNegotiateAmtPercentage / 100);
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  useEffect(() => {
    if (negotiateAmt > maxNegotiateAmount) {
      setNegotiateAmt(maxNegotiateAmount);
    }
  }, [negotiateAmt, maxNegotiateAmount]);

  const handleNegotiate = () => {
    onNegotiate(negotiateAmt);
  };

  const handleAccept = () => {
    onAccept();
  };

  return (
    <div
      className="negotiate-form"
      style={{
        overflow: "auto",
        wordWrap: "break-word",
        scrollbarWidth: "none", 
      }}
      data-aos="zoom-in-up"
    >
      <h3 style={{ color: "black", textAlign: "center", marginBottom: "1rem" }}>
        Negotiate Form
      </h3>
      <h5 style={{ color: "black", marginBottom: "1.5rem" }}>
        <u>Offer Details</u>
      </h5>
      <div
        className="offer-user-details"
        style={{
          color: "black",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <p>Passenger Name : {offer.username}</p>
        <p>Contact : {offer.contact}</p>
      </div>
      <div
        className="offer-user-locDetails"
        style={{
          color: "black",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <p>
          Pick up :{" "}
          {offer.usrsrc.length > 10
            ? offer.usrsrc.substr(0, 10) + "..."
            : offer.usrsrc}
        </p>
        <p>
          Destination :{" "}
          {offer.usrdst.length > 10
            ? offer.usrdst.substr(0, 10) + "..."
            : offer.usrdst}
        </p>
      </div>
      <div
        className="offer-user-other"
        style={{
          color: "black",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <p>Offered Amount : &#8377;{offer.offeredamt}</p>
        <p>Passengers Count : {offer.passengerCount}</p>
      </div>
      <div
        className="offer-negotiate-amt"
        style={{ marginLeft: "2rem", marginTop: "1rem" }}
      >
        <label htmlFor="negotiate-amt" style={{ color: "black" }}>
          Negotiation amount
        </label>
        <br />
        <span style={{ color: "black", fontSize: "1.2rem" }}>&#8377;</span>
        <input
          type="number"
          id="negotiate-amt"
          defaultValue={negotiateAmt}
          max={maxNegotiateAmount}
          onChange={(e) => setNegotiateAmt(e.target.value)}
        />
      </div>
      <div className="negotiate-btns">
        <button onClick={handleNegotiate}>Negotiate</button>
        <button onClick={handleAccept}>Accept</button>
        <button onClick={onClose}>cancel</button>
      </div>
    </div>
  );
};
const ReceiveOffers = () => {
  const [offers, setOffers] = useState([]);
  const [showNegotiateForm, setShowNegotiateForm] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState({});
  const [negotiateAmt, setNegotiateAmt] = useState(0);
  const { user } = useUser();
  useEffect(() => {
    // Ensure user is defined before making API call
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      socket.emit("join", user?.primaryWeb3Wallet.web3Wallet);
      axios
        .post("http://localhost:9000/offeredRide/getOffers", {
          metaid: user.primaryWeb3Wallet.web3Wallet,
        })
        .then((res) => {
          // console.log(res);
          setOffers(res.data);
        })
        .catch((error) => {
          console.error("Failed to fetch offers:", error);
        });
    }

    socket.on("reject", (data) => {
      alert(
        `Your negotiation of ₹${data.offered} for ${data.pickup.substr(
          0,
          25
        )} to ${data.drop.substr(0, 25)} has been rejected by ${data.username}`
      );
    });

    return () => {
      socket.off("reject");
    };
  }, [user]);

  const onClickCard = (offer) => {
    setSelectedOffer(offer);
    setShowNegotiateForm(true);
  };
  const onCloseNegotiationForm = async () => {
    socket.emit("rejectrider", {
      driver_id: user?.primaryWeb3Wallet.web3Wallet,
      userid: selectedOffer.userid,
      drivername: user?.username,
    });
    await axios.post("http://localhost:9000/offeredRide/rejectOffer", {
      metaid: user.primaryWeb3Wallet.web3Wallet,
      userid: selectedOffer.userid,
    });
    setShowNegotiateForm(false);
  };

  const handleAccept = () => {
    // axios
    //   .post("http://localhost:9000/offeredRide/acceptOffer", {
    //     metaid: user.primaryWeb3Wallet.web3Wallet,
    //     offerid: selectedOffer.userid,
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     setShowNegotiateForm(false);
    //   })
    //   .catch((error) => {
    //     console.error("Failed to accept offer:", error);
    //   });
    socket.emit("acceptOffer", {
      acceptedamt: selectedOffer.offeredamt,
      userid: selectedOffer.userid,
      passengerCount: selectedOffer.passengerCount,
      driver_id: user?.primaryWeb3Wallet.web3Wallet,
      drivername: user?.username,
      pickup: selectedOffer.usrsrc,
      drop: selectedOffer.usrdst,
      drivercontact: user?.primaryPhoneNumber.phoneNumber,
    });
    setShowNegotiateForm(false);
  };

  const handleNegotiate = (negotiateAmt) => {
    // Handle negotiation logic here
    socket.emit("negotiateOffer", {
      driver_id: user?.primaryWeb3Wallet.web3Wallet,
      userid: selectedOffer.userid,
      negotiatedamt: negotiateAmt,
      drivername: user?.username,
      drivercontact: user?.primaryPhoneNumber.phoneNumber,
      passengerCount: selectedOffer.passengerCount,
      pickup: selectedOffer.usrsrc,
      drop: selectedOffer.usrdst,
    });
    setShowNegotiateForm(false);
  };

  return (
    <div>
      <AppNav />
      <div>
        {offers.length > 0 ? (
          offers
            .filter((offer) => !offer.rejected)
            .map((offer) => {
              return (
                <OffersCard
                  key={offer.userid}
                  offer={offer}
                  handleClick={onClickCard}
                />
              );
            })
        ) : (
          <div>No offers found</div>
        )}
      </div>
      {showNegotiateForm && (
        <div className="overlay">
          <NegotiationForm
            onClose={onCloseNegotiationForm}
            offer={selectedOffer}
            onNegotiate={handleNegotiate}
            onAccept={handleAccept}
          />
        </div>
      )}
    </div>
  );
};

export default ReceiveOffers;
