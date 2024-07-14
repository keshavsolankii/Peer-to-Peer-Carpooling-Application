import React from "react";
import "../styles/regscreen.css";
import { useNavigate } from "react-router-dom";
import car from '../assets/mcqueen.png'
import { ReactTyped } from "react-typed";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const onClickSignIn = () => {
    navigate("/signin");
  };
  const onClickSignUp = () => {
    navigate("/signup");
  };
  return (
    <div className="container">
      
    <br />

    {/* <ReactTyped
      strings={[
        "Search for products",
        "Search for categories",
        "Search for brands",
      ]}
      typeSpeed={40}
      backSpeed={50}
      attr="placeholder"
      loop
    >
      <input type="text" />
    </ReactTyped> */}

      <div className="app-image">
      <img src={car} alt="" data-aos="slide-left"/>
      <h1 className="typed"><ReactTyped strings={["BlockChain Powered Car Pooling", "A Revolution in the world of Car Pooling","'Decentralization' for Trust and Security","Ensuring money security","Secure payments b/w users"]} typeSpeed={20} backSpeed={10} loop/></h1>
      </div>
      <div className="app-options">
        <div className="wlc-msg" data-aos="fade-up">
          <h1 className="poppins-regular">Welcome to Carpooling</h1>
          {/* <ReactTyped strings={["Welcome to Carpooling"]} typeSpeed={40} backSpeed={10}/> */}
        </div>
        <div className="btns" data-aos="fade-down">
          <button
            className="signInbtn btn poppins-regular"
            onClick={onClickSignIn}
          >
            Sign In
          </button>
          <button
            className="signUpbtn btn poppins-regular"
            onClick={onClickSignUp}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
