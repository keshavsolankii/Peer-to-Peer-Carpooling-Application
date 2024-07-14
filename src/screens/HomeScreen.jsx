import React, { useState, useEffect, useLayoutEffect } from "react";
import "../styles/homescreen.css";
import { Link, NavLink } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import axios from "axios";

import img1 from "../assets/c1.png";
import img2 from "../assets/c2.png";
import img3 from "../assets/c3.png";
import img4 from "../assets/c4.png";
import img5 from "../assets/c5.png";
import car from "../assets/mcqueen.png";
const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const primaryWeb3Wallet = user?.primaryWeb3Wallet;

  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      axios
        .post("http://localhost:9000/adduser", {
          metaid: user.primaryWeb3Wallet.web3Wallet,
          username: user.username,
          contact: user.primaryPhoneNumber.phoneNumber,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const onClickBookRide = () => {
    navigate("/bookride");
  };

  const onClickOfferRide = () => {
    navigate("/offeride");
  };

  const checkIfUserHasMetamask = () => {
    if (
      primaryWeb3Wallet === "" ||
      primaryWeb3Wallet === null ||
      primaryWeb3Wallet === undefined
    ) {
      return (
        <div className="meta-msg">
          <span>
            Metamask not connected. Please connect to metamask in user {">"}{" "}
            manage account {">"} Web3 Wallets.
          </span>
        </div>
      );
    }
  };

  const [slideIndex, setSlideIndex] = useState(0);

  useLayoutEffect(() => {
    const showSlides = () => {
      const slides = document.querySelectorAll(".carousel-item");
      if (slideIndex >= slides.length) {
        setSlideIndex(0);
      } else if (slideIndex < 0) {
        setSlideIndex(slides.length - 1);
      }
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex].style.display = "block";
    };

    // Automatic rotation
    const interval = setInterval(() => {
      setSlideIndex((prevIndex) => prevIndex + 1);
      showSlides();
    }, 5000);

    return () => clearInterval(interval);
  }, [slideIndex]);

  //date for form
  const date = new Date();
  var curDate =
    date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();

  return (
    <div className="home-container">
      {checkIfUserHasMetamask()}
      <AppNav />
      <div className="carousel" id="myCarousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-aos="fade-up">
            <img src={img1} alt="Image 1" className="image" />
            <div className="carousel-caption">
              <h4>BlockChain Powered Car Pooling</h4>
              <h6>A Revolution in the world of Car Pooloing.</h6>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img2} alt="Image 2" className="image" />
            <div className="carousel-caption">
              <h4>Multiple Upsides</h4>
              <h6>
                The project comes with a wide variety of both <br />{" "}
                Environmental & Technological advantages.
              </h6>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img3} alt="Image 3" className="image" />
            <div className="carousel-caption">
              <h4>Decentralization</h4>
              <h6>
                Blockchain comes with the feature of 'Decentralization'
                <br /> enhancing Trust and Security.
              </h6>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img4} alt="Image 4" className="image" />
            <div className="carousel-caption">
              <h4>Smart Contracts</h4>
              <h6>
                Ensuring money security and secure & seamless payments b/w
                users.
              </h6>
            </div>
          </div>
          <div className="carousel-item">
            <img src={img5} alt="Image 5" className="image" />
            <div className="carousel-caption">
              <h4>Join Us!!</h4>
              <h6>
                Become a part of our family and revolutionize car-pooling.
              </h6>
            </div>
          </div>
        </div>

        {/* <button class="carousel-btn prev-btn" onClick="prevSlide()">&#10094;</button>
        <button class="carousel-btn next-btn" onClick="nextSlide()">&#10095;</button> */}
      </div>
      <hr className="rule1" data-aos="fade-up" />
      <br />
      <hr className="rule2" data-aos="fade-down" />

      <div className="homescreen-body">
        <h1 data-aos="fade-up">
          <u>Let's Go For A Ride!</u>
        </h1>
        <div className="rideDetails">
          <div className="rideImage" data-aos="fade-left">
            <img src={car} alt="Car Image" data-aos="zoom-in" data-aos-offset="300"/>
          </div>
          <div className="rideForm" data-aos="fade-up">
            <h2 data-aos="flip-up" data-aos-offset="300">"Choose What You Desire"</h2>
            <br />
            <br />
            {/* <h3>Enter Source</h3>
            <br />
            <input
              type="text"
              name="source"
              placeholder="Source"
              className="ip"
            />
            <br />
            <br />
            <h3>Enter Destination</h3>
            <br />
            <input
              type="text"
              name="source"
              placeholder="Destination"
              className="ip"
            />
            <br />
            <br />
            <h3>Enter Date</h3>
            <br />
            <input type="date" name="date" id="date" className="ip" /> */}
            {/* <button type="submit" value="Send" className="submitBtn">
              Submit
            </button> */}
            <button className="btn" onClick={onClickBookRide} data-aos="zoom-in-left">
              Book a Ride
            </button>
            <button className="btn" onClick={onClickOfferRide} data-aos="zoom-in-right">
              Offer a Ride
            </button>
          </div>
        </div>
      </div>
      <br />

      <div className="footer">
        Copyright &#169; 2024 Ether-Shuttle. All rights received.
      </div>
    </div>
  );
};

export default HomeScreen;
