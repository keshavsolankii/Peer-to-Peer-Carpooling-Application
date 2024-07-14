import React, { useState, useEffect, useRef } from "react";
import AppNav from "../components/AppNav";
import Footer from "../components/Footer";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { Placeholder } from "react-bootstrap";
import "../styles/bookride.css";
import RideCard from "../components/RideCard";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { get, set } from "mongoose";

const socket = io.connect("http://localhost:9001");
const ConfirmForm = ({ onClose, ride, src, dest }) => {
  const { user } = useUser();
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      console.error("User is not defined");
      return;
    }
    console.log("Submitted");
    console.log(user.id);
    const data = {
      username: userName,
      userid: user.primaryWeb3Wallet.web3Wallet,
      user_contact: user.primaryPhoneNumber.phoneNumber,
      source: src,
      dest: dest,
      offered: offeredamount,
      passengers_count: passengers,
      driver_id: ride.metaid,
    };

    if (passengers > ride.availableSeats) {
      alert("Not enough seats available");
      return;
    }

    if (data.source == "" || data.dest == "") {
      alert("Please enter source and destination");
      return;
    }
    const broadcast = socket.emit("sendoffer", data);
    axios.post("http://localhost:9000/offeredRide/updateOffers", {
      metaid: data.driver_id,
      userid: data.userid,
      username: data.username,
      contact: data.user_contact,
      offeredamt: data.offered,
      usrsrc: data.source,
      usrdst: data.dest,
      passengerscnt: data.passengers_count,
    });
    console.log(broadcast);
    onClose();
  };
  const [userName, setUserName] = useState(user.username);

  const [offeredamount, setOfferedAmount] = useState(100);
  const [passengers, setPassengers] = useState(1);

  return (
    <div
      className="confirm-form"
      style={{
        height: "max-content",
        overflow: "auto",
        wordWrap: "break-word",
        scrollbarWidth: "none",
        textAlign: "center",
      }}
      data-aos="zoom-in-up"
    >
      <h3
        style={{ color: "black", textAlign: "center", marginBottom: "0.8rem" }}
      >
        Confirm Ride
      </h3>
      <h5 style={{ color: "black", marginBottom: "0.8rem" }}>Ride Details</h5>
      <div className="selected-ride-details" style={{ color: "black" }}>
        <p>Driver Name : {ride.driver}</p>
        <p>Car Name : {ride.carName}</p>
      </div>
      <h5 style={{ color: "black", marginBottom: "0.8rem" }}>User Details</h5>
      <form
        method="post"
        onSubmit={handleSubmit}
        style={{ marginTop: "1.7rem" }}
      >
        <div className="form-user-details">
          <div className="form-name" style={{ display: "inline-block" }}>
            <label htmlFor="name" style={{ color: "black" }}>
              Name
            </label>
            <br />
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
            />
          </div>
          <div
            className="form-contact"
            style={{
              display: "inline-block",
              color: "black",
              marginRight: "1rem",
            }}
          >
            <label htmlFor="contact" style={{ color: "black" }}>
              Contact
            </label>
            <br />
            <div id="contact">{user.primaryPhoneNumber.phoneNumber}</div>
          </div>
        </div>
        <div
          className="input-wrapper"
          style={{
            display: "flex",
            marginTop: "1rem",
            justifyContent: "space-around",
          }}
        >
          <div>
            <label htmlFor="amount" style={{ color: "black" }}>
              Offered Amount
            </label>
            <br />
            <span
              className="rupee"
              style={{ marginRight: "5px", color: "black" }}
            >
              ₹
            </span>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              defaultValue={offeredamount}
              onChange={(e) => setOfferedAmount(e.target.value)}
              min={100}
            />
          </div>
          <div>
            <label htmlFor="seats" style={{ color: "black" }}>
              Passengers
            </label>
            <br />
            <input
              type="number"
              id="seats"
              name="seats"
              required
              defaultValue={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              min={1}
            />
          </div>
        </div>
        <div className="form-buttons" style={{ marginTop: "2.5rem" }}>
          <button type="submit" className="form-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button onClick={onClose} className="form-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const Form = ({ negotiationDetails, handleAccept, handleReject }) => {
  useEffect(() => {
    // When the component mounts, add the no-scroll class to the body
    document.body.classList.add("no-scroll");

    // When the component unmounts, remove the no-scroll class from the body
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, []);

  console.log(negotiationDetails);
  return (
    <div className="form">
      <div className="form-header">
        <h3 style={{ fontWeight: "700", textAlign: "center" }}>Negotiate</h3>
      </div>
      <div className="form-body">
        <div className="form-user-details">
          <div className="form-driver-name">
            Driver Name : {negotiationDetails.drivername}
          </div>
          <div className="form-driver-contact">
            Driver Contact : {negotiationDetails.drivercontact}
          </div>
        </div>
        <div className="form-offer-details">
          Negotiated amount : &#8377;{negotiationDetails.negotiatedamt}
        </div>
        <div>
          <p>Passengers : {negotiationDetails.passengerCount}</p>
          <p>
            Pick up :{" "}
            {negotiationDetails.pickup.length > 40
              ? negotiationDetails.pickup.substr(0, 40) + "..."
              : negotiationDetails.pickup}
          </p>
          <p>
            Drop :{" "}
            {negotiationDetails.drop.length > 40
              ? negotiationDetails.drop.substr(0, 40) + "..."
              : negotiationDetails.drop}
          </p>
        </div>
      </div>
      <div className="form-buttons">
        <button className="form-btn" onClick={handleAccept}>
          Accept
        </button>
        <button className="form-btn" onClick={handleReject}>
          Reject
        </button>
      </div>
    </div>
  );
};

const BookRide = () => {
  const [location, setLocation] = useState({
    lat: 28.63041213046698,
    lng: 77.37111466441804,
  });
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: ["places"],
  });
  const caricon = "/circle.png";

  const [rides, setRides] = useState([]);
  const { user } = useUser();
  const baseurl = import.meta.env.VITE_BASE_URL;
  const sourceRef = useRef();
  const destRef = useRef();
  const [filteredRides, setFilteredRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(baseurl + "/get");
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error("Failed to fetch rides:", error);
      }
    };
    fetchRides();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.log(error)
      );
    }
    // const intervalId = setInterval(fetchRides, 60 * 1000);
    // return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      socket.on(`recieveoffer`, (data) => {
        if (data.driver_id === user.primaryWeb3Wallet.web3Wallet) {
          alert(`${data.offered.toString()} ${data.username} ${data.source}`);
        }
      });
      socket.on(`offeraccepted`, (data) => {
        if (data.userid === user.primaryWeb3Wallet.web3Wallet) {
          alert(
            `Your offer of ₹${data.acceptedamt} has been accepted by ${data.drivername}`
          );
          navigate("/payment", {
            state: {
              drivername: data.drivername,
              acceptedamt: data.acceptedamt,
              pickup: data.pickup,
              drop: data.drop,
              driverid: data.driver_id,
              userid: data.userid,
              passengerCount: data.passengerCount,
              drivercontact: data.drivercontact,
            },
          });
        }
      });

      socket.on(`negotiate`, (data) => {
        if (data.userid === user.primaryWeb3Wallet.web3Wallet) {
          alert(`${data.drivername} is negotiating with you.`);
          setNegotiationDetails(data);
          setForm(true);
        }
      });

      socket.on(`rejectride`, (data) => {
        if (data.userid === user.primaryWeb3Wallet.web3Wallet) {
          alert(`${data.drivername} has rejected your offer.`);
        }
      });

      return () => {
        socket.off(`recieveoffer`);
        socket.off(`offeraccepted`);
        socket.off(`negotiate`);
        socket.off("rejectride");
      };
    }
  }, [user]);
  const geocoder = new google.maps.Geocoder();
  const calculateRoute = async () => {
    if (sourceRef.current.value === "" || destRef.current.value === "") {
      return;
    }

    const directionsService = new google.maps.DirectionsService();

    const results = await directionsService.route({
      origin: sourceRef.current.value,
      destination: destRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionResponse(results);

    try {
      const pickuplatlngPromise = getLatlng(sourceRef.current.value);
      const droplatlngPromise = getLatlng(destRef.current.value);

      // Await the promises to get the resolved values
      const pickuplatlng = await pickuplatlngPromise;
      const droplatlng = await droplatlngPromise;

      console.log(pickuplatlng, droplatlng);

      const fetchRoutes = rides.map(async (ride) => {
        const createPath = await directionsService.route({
          origin: ride.source,
          destination: ride.dest,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        return createPath.routes[0].overview_path;
      });

      // Wait for all route calculations to complete using Promise.all
      Promise.all(fetchRoutes).then((routePaths) => {
        const filtered = rides.filter((ride, index) => {
          const distanceToRoute = calculateNearestDistanceToRoute(
            pickuplatlng,
            routePaths[index]
          );
          const distanceToRoute2 = calculateNearestDistanceToRoute(
            droplatlng,
            routePaths[index]
          );
          return distanceToRoute <= 10000 && distanceToRoute2 <= 10000;
        });
        setFilteredRides(filtered);
      });
    } catch (error) {
      console.error("Error calculating route:", error);
    }
  };
  const getLatlng = async (address) => {
    return axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API}`
      )
      .then((res) => {
        const data = res.data;
        const coordinates = data.results[0].geometry.location;
        return coordinates;
      })
      .catch((error) => {
        console.error("Error getting latitude and longitude:", error);
        throw error; // Rethrow the error to handle it at a higher level
      });
  };

  const calculateNearestDistanceToRoute = (point, routePath) => {
    let minDistance = Infinity;

    for (let i = 0; i < routePath.length - 1; i++) {
      const start = routePath[i];
      const end = routePath[i + 1];
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        point,
        google.maps.geometry.spherical.interpolate(start, end, 0.5)
      );

      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    return minDistance;
  };

  const navigate = useNavigate();
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [negotiationDetails, setNegotiationDetails] = useState({});
  const [form, setForm] = useState(false);
  const [directionResponse, setDirectionResponse] = useState(null);
  const handleRideClick = (ride) => {
    socket.emit("join", ride.metaid);
    setSelectedRide(ride);
    setShowConfirmForm(true);
  };
  const handleCloseConfirmForm = () => {
    setShowConfirmForm(false);
  };

  const onClickAccept = async () => {
    await axios.post("http://localhost:9000/offeredRide/acceptOffer", {
      userid: negotiationDetails.userid,
      metaid: negotiationDetails.driver_id,
      acceptedamt: parseInt(negotiationDetails.negotiatedamt),
      passengerCount: negotiationDetails.passengerCount,
    });
    setForm(false);
    navigate("/payment", {
      state: {
        drivername: negotiationDetails.drivername,
        acceptedamt: negotiationDetails.negotiatedamt,
        pickup: negotiationDetails.pickup,
        drop: negotiationDetails.drop,
        driverid: negotiationDetails.driver_id,
        userid: negotiationDetails.userid,
        passengerCount: negotiationDetails.passengerCount,
        drivercontact: negotiationDetails.drivercontact,
      },
    });
  };

  const onClickReject = async () => {
    axios.post("http://localhost:9000/offeredRide/rejectOffer", {
      userid: negotiationDetails.userid,
      metaid: negotiationDetails.driver_id,
    });
    socket.emit("rejectOffer", {
      driver_id: negotiationDetails.driver_id,
      userid: negotiationDetails.userid,
      username: user.username,
      pickup: negotiationDetails.pickup,
      drop: negotiationDetails.drop,
      offered: negotiationDetails.negotiatedamt,
    });
    setForm(false);
  };

  return (
    <div className="bookride-container">
      <AppNav />
      <div className="loc-details">
        <div className="firstObj" data-aos="fade-left">
          <div>
            <i className="fa-solid fa-map-pin"></i>
          </div>
          <div className="pickUp">
            <Autocomplete>
              <input
                type="text"
                id="source"
                name="source"
                className="ip"
                required
                ref={sourceRef}
              />
            </Autocomplete>
          </div>
        </div>
        <div className="firstObj" data-aos="fade-right">
          <div>
            <i className="fa-solid fa-location-arrow"></i>
          </div>
          <div className="drop">
            <Autocomplete>
              <input
                type="text"
                id="dest"
                name="dest"
                className="ip"
                required
                ref={destRef}
              />
            </Autocomplete>
          </div>
        </div>
      </div>
      <div className="buttons" data-aos="flip-down">
        <button className="btn" onClick={calculateRoute}>
          Search Rides
        </button>
        <button
          className="btn"
          onClick={() => {
            setDirectionResponse(null);
            sourceRef.current.value = "";
            destRef.current.value = "";
          }}
        >
          Reset
        </button>
      </div>
      {!isLoaded ? (
        <div>Loading....</div>
      ) : (
        <div className="map-container">
          <GoogleMap
            center={location}
            zoom={16}
            mapContainerStyle={{
              height: "70vh",
              width: "80vw",

              borderRadius: "2%",
              border: "1px solid antiquewhite",
            }}
            options={{
              disableDefaultUI: true,
              fullscreenControl: false,
              keyboardShortcuts: false,
            }}
          >
            <Marker position={location}></Marker>
            {directionResponse && (
              <DirectionsRenderer
                directions={directionResponse}
              ></DirectionsRenderer>
            )}
          </GoogleMap>
        </div>
      )}
      <h2
        style={{
          textAlign: "center",
          textDecoration: "underline",
          fontFamily: "lato",
          fontWeight: "700",
          fontSize: "2.7rem",
        }}
        data-aos="fade-right"
      >
        Available Rides
      </h2>
      {filteredRides.length > 0 ? (
        <div className="ride-list">
          {filteredRides.map((ride, index) =>
            ride.metaid !== user?.primaryWeb3Wallet?.web3Wallet &&
            ride.availableSeats > 0 ? (
              <RideCard
                key={index}
                rideObj={ride}
                handleRideClick={handleRideClick}
              />
            ) : null
          )}
        </div>
      ) : (
        <div>No rides available</div>
      )}
      {showConfirmForm && (
        <div className="overlay">
          <ConfirmForm
            onClose={handleCloseConfirmForm}
            ride={selectedRide}
            src={sourceRef.current.value}
            dest={destRef.current.value}
          />
        </div>
      )}
      {form && (
        <div className="overlay">
          <Form
            negotiationDetails={negotiationDetails}
            handleAccept={onClickAccept}
            handleReject={onClickReject}
          />
        </div>
      )}
      <br />
      <Footer />
    </div>
  );
};

export default BookRide;
