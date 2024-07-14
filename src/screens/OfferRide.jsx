import React, { useRef, useEffect, useState } from "react";
import "../styles/offerride.css";
import axios from "axios";
import formBg from "../assets/gmap_bg.jpg";
import { useUser } from "@clerk/clerk-react";
import AppNav from "../components/AppNav";
import { io } from "socket.io-client";
import { set } from "mongoose";
import Footer from "../components/Footer";
const socket = io.connect("http://localhost:9001");

const NegotiationForm = ({ onClose, offer, onNegotiate, onAccept }) => {
  const [negotiateAmt, setNegotiateAmt] = useState(offer.offered);
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  const handleNegotiate = () => {
    // Handle negotiation logic
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
        <p>Contact : {offer.user_contact}</p>
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
          {offer.source.length > 10
            ? offer.source.substr(0, 10) + "..."
            : offer.source}
        </p>
        <p>
          Destination :{" "}
          {offer.dest.length > 10
            ? offer.dest.substr(0, 10) + "..."
            : offer.dest}
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
        <p>Offered Amount : &#8377;{offer.offered}</p>
        <p>Passengers Count : {offer.passengers_count}</p>
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
          onChange={(e) => setNegotiateAmt(e.target.value)}
          style={{ color: "black" }}
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
const OfferRide = ({ apiKey }) => {
  const { user } = useUser();
  const mapRef = useRef();
  const sourceInputRef = useRef();
  const destinationInputRef = useRef();
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [offers, setoffers] = useState([]);
  const [showNegotiateForm, setShowNegotiateForm] = useState(false);
  // const [offer, setOffer] = useState({});
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [apiKey]);

  useEffect(() => {
    if (directionsService && source && destination) {
      calculateAndDisplayRoute();
    }
  }, [directionsService, source, destination]);

  useEffect(() => {
    socket.emit("join", user?.primaryWeb3Wallet.web3Wallet);
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      // Socket listener for receiving offers
      socket.emit("join", user?.primaryWeb3Wallet.web3Wallet);
      socket.on("recieveoffer", (data) => {
        if (data.driver_id === user.primaryWeb3Wallet.web3Wallet) {
          console.log("received offer");
          setoffers((prevOffers) => [...prevOffers, data]);
        }
      });
      socket.on("reject", (data) => {
        alert(
          `Your negotiation of ₹${data.offered} for ${data.pickup.substr(
            0,
            25
          )} to ${data.drop.substr(0, 25)} has been rejected by ${
            data.username
          }`
        );
        setoffers((prevOffers) =>
          prevOffers.filter((offer) => offer !== data.userid)
        );
      });

      // Clean up socket listener
      return () => {
        socket.off("recieveOffer");
        socket.off("reject");
      };
    }
  }, []);
  // useEffect(() => {
  //   if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
  //     const handler = (data) => {
  //       if (data.driver_id === user.primaryWeb3Wallet.web3Wallet) {
  //         setoffers((offers) => [...offers, data]);
  //         alert(
  //           `${data.username} offered ${data.offered} for ${data.source} to ${data.dest}`
  //         );
  //       }
  //       if (offers.length > 0) {
  //         offers.forEach((el) => {
  //           setOffer(el);
  //           setShowNegotiateForm(true);
  //           setoffers(offers.filter((el) => el !== offer));
  //         });
  //       }
  //     };

  //     socket.on("recieveoffer", handler);

  //     return () => {
  //       socket.off("recieveoffer", handler);
  //     };
  //   }
  // }, [socket, user, offers, offer]);
  useEffect(() => {
    // Display negotiation form when offers change
    if (offers.length > 0) {
      setShowNegotiateForm(true);
    }
  }, [offers]);

  const handleNegotiate = (negotiateAmt) => {
    // Handle negotiation logic here
    socket.emit("negotiateOffer", {
      driver_id: user?.primaryWeb3Wallet.web3Wallet,
      userid: offers[currentOfferIndex].userid,
      negotiatedamt: negotiateAmt,
      passengerCount: offers[currentOfferIndex].passengers_count,
      drivername: user?.username,
      drivercontact: user?.primaryPhoneNumber.phoneNumber,
      pickup: offers[currentOfferIndex].source,
      drop: offers[currentOfferIndex].dest,
    });
    // Move to next offer after negotiation
    setCurrentOfferIndex((prevIndex) => prevIndex + 1);
    setShowNegotiateForm(false);
  };

  const handleAccept = () => {
    // Handle accept logic here
    console.log("Offer accepted");
    socket.emit("acceptOffer", {
      acceptedamt: offers[currentOfferIndex].offered,
      userid: offers[currentOfferIndex].userid,
      driver_id: user?.primaryWeb3Wallet.web3Wallet,
      passengerCount: offers[currentOfferIndex].passengers_count,
      drivername: user?.username,
      pickup: offers[currentOfferIndex].source,
      drop: offers[currentOfferIndex].dest,
      drivercontact: user?.primaryPhoneNumber.phoneNumber,
    });
    // Move to next offer after acceptance
    setCurrentOfferIndex((prevIndex) => prevIndex + 1);
    setShowNegotiateForm(false);
  };

  const handleCloseNegotiationForm = async () => {
    // Close negotiation form
    // socket.emit("rejectrider", {
    //   driver_id: user?.primaryWeb3Wallet.web3Wallet,
    //   userid: offers[currentOfferIndex].userid,
    //   drivername: user?.username,
    // });
    // await axios.post("http://localhost:9000/offeredRide/rejectOffer", {
    //   metaid: user.primaryWeb3Wallet.web3Wallet,
    //   userid: selectedOffer.userid,
    // });
    setShowNegotiateForm(false);
  };

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 28.6312, lng: 77.3709 },
      zoom: 15,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    setDirectionsService(directionsService);
    setDirectionsRenderer(directionsRenderer);

    // Initialize autocomplete for source and destination input fields
    const sourceAutocomplete = new window.google.maps.places.Autocomplete(
      sourceInputRef.current
    );
    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      destinationInputRef.current
    );

    sourceAutocomplete.addListener("place_changed", () => {
      const place = sourceAutocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place not found");
        return;
      }
      setSource(place.formatted_address);
    });

    destinationAutocomplete.addListener("place_changed", () => {
      const place = destinationAutocomplete.getPlace();
      if (!place.geometry) {
        console.log("Place not found");
        return;
      }
      setDestination(place.formatted_address);
    });
  };

  const calculateAndDisplayRoute = () => {
    if (!directionsService || !source || !destination) {
      return;
    }

    directionsService.route(
      {
        origin: source,
        destination: destination,
        travelMode: "DRIVING",
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
        } else {
          console.error("Directions request failed due to " + status);
        }
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (
      !source ||
      !destination ||
      !time ||
      !totalSeats ||
      !carnumber ||
      !carname
    ) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      axios
        .post("http://localhost:9000/offeredRide/post", {
          source: sourceInputRef.current.value,
          driver: user?.username,
          dest: destinationInputRef.current.value,
          time: time.toString(),
          metaid: user?.primaryWeb3Wallet.web3Wallet,
          totalSeats: parseInt(totalSeats),
          carNumber: carnumber,
          contact: parseInt(user?.primaryPhoneNumber.phoneNumber),
          carName: carname,
        })
        .then((res) => {
          setCarname("");
          setCarnumber("");
          setTime("");
          setTotalSeats(4);
          alert(res.data);
        })
        .catch((err) => {
          console.log(err);
          alert(err);
        });
    } catch (error) {
      console.error(error);
      alert("An error occurred while offering the ride.");
    }
  };

  const [time, setTime] = useState("");
  const [totalSeats, setTotalSeats] = useState(4);
  const [carname, setCarname] = useState("");
  const [carnumber, setCarnumber] = useState("");
  return (
    <div>
      <div className="outer">
      <AppNav />
        {/* <br /> */}
        <br />
        <div className="topHeading" data-aos="flip-up">
          {" "}
          <h1>"Offer Your Ride"</h1>{" "}
        </div>

        <form>
          <div className="inputForm" data-aos="zoom-in-up">
            <div className="formLine line1">
              <div className="firstObj">
                <div className="icon">
                  <i className="fa-solid fa-map-pin"></i>
                </div>
                <input
                  type="text"
                  placeholder="Enter source"
                  className="ip"
                  ref={sourceInputRef}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <div className="firstObj">
                <div className="icon">
                  <i className="fa-solid fa-car"></i>
                </div>
                <input
                  type="text"
                  name="carname"
                  id="car"
                  className="ip"
                  value={carname}
                  placeholder="Enter Car Name"
                  onChange={(e) => setCarname(e.target.value)}
                />
              </div>

              <div className="firstObj">
                <div className="icon">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <input
                  type="time"
                  name="time"
                  id="time"
                  className="ip"
                  value={time}
                  onChange={(e) => {
                    setTime(e.currentTarget.value);
                  }}
                />
              </div>
            </div>

            <div className="formLine line2">
              <div className="secondObj">
                <div className="icon">
                  <i className="fa-solid fa-location-arrow"></i>
                </div>
                <input
                  type="text"
                  placeholder="Enter destination"
                  className="ip"
                  ref={destinationInputRef}
                />
              </div>

              <div className="secondObj">
                <div className="icon">
                  <i className="fa-solid fa-rug"></i>
                </div>
                <input
                  type="text"
                  name="carnumber"
                  id="carnumber"
                  className="ip"
                  placeholder="Enter Car Number"
                  value={carnumber}
                  onChange={(e) => setCarnumber(e.target.value)}
                />
              </div>

              <div className="secondObj">
                <div className="icon">
                  <i className="fa-solid fa-person"></i>
                </div>
                <select
                  id="seats"
                  name="seats"
                  className="dropdown ip"
                  defaultValue={totalSeats}
                  onChange={(e) => setTotalSeats(e.target.value)}
                >
                  <option value="1" className="ip">
                    1
                  </option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
          </div>
          <div className="btn1">
            <button
              onClick={handleSubmit}
              type="submit"
              style={{
                padding: "1rem",
                border: "none",
                marginBottom: "1rem",
                background: "rgb(45, 167, 243)",
                borderRadius: "10px",
                fontSize: "larger",
                fontWeight: "700",
                width: "15rem",
              }}
            >
              Offer Ride
            </button>
          </div>
        </form>

        <div
          style={{
            height: "80vh",
            width: "80%",
            border: "5px",
            borderRadius: "50px",
            marginLeft: "10%",
          }}
          ref={mapRef}
        ></div>
        <br />
      </div>
      {showNegotiateForm && (
        <div className="overlay">
          <NegotiationForm
            onClose={handleCloseNegotiationForm}
            offer={offers[currentOfferIndex]}
            onNegotiate={handleNegotiate}
            onAccept={handleAccept}
          />
        </div>
      )}
      <Footer/>
    </div>
  );
};

export default OfferRide;
