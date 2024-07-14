import "./App.css";
import { useUser } from "@clerk/clerk-react";
import { useState, useLayoutEffect, useEffect } from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import { useNavigate, Routes, Route } from "react-router-dom";
import RegisterScreen from "./screens/RegisterScreen";
import Signin from "./screens/Signin";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import BookRide from "./screens/BookRide";
import OfferRide from "./screens/OfferRide";
import PaymentScreen from "./screens/PaymentScreen";
import Success from "./screens/success";
import Cancel from "./screens/cancel";
import ReceiveOffers from "./screens/ReceiveOffers";
import PastRides from "./screens/PastRides";
import AllOfferedRides from "./screens/AllOfferedRides";

function App() {
  const user = useUser();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (user.isSignedIn) {
      navigate("/home");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<RegisterScreen />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/bookride" element={<BookRide />} />
      <Route
        path="/offeride"
        element={<OfferRide apiKey="AIzaSyDL5-CyNG5jVL9Kp62pDanJqwipxWV3-b0" />}
      />
      <Route path="/offers" element={<ReceiveOffers />} />
      <Route path="/payment" element={<PaymentScreen></PaymentScreen>} />
      <Route
        path="/success/:driverid/:userid/:passengerCount"
        element={<Success></Success>}
      />
      <Route path="/pastRides" element={<PastRides></PastRides>}></Route>
      <Route path="/offered" element={<AllOfferedRides />}></Route>
      <Route path="/cancel" element={<Cancel />}></Route>
      <Route path="*" element={<h1>404:Page not found</h1>} />
    </Routes>
  );
}

export default App;
