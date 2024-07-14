import React, { useEffect, useState } from "react";
import PrevRideCard from "../components/PrevRideCard";
import "../styles/pastRides.css";
import AppNav from "../components/AppNav";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { set } from "mongoose";
const PastRides = () => {
  const { user } = useUser();
  const [pastRides, setPastRides] = useState([]);
  useEffect(() => {
    if (user && user.primaryWeb3Wallet && user.primaryWeb3Wallet.web3Wallet) {
      axios
        .post("http://localhost:9000/getPastRides", {
          metaid: user.primaryWeb3Wallet.web3Wallet,
        })
        .then((res) => {
          setPastRides(res.data);
        });
    }
  }, [user]);
  return (
    <div>
      <AppNav />
      <div className="past-rides-container">
        <div className="past-rides">
          {pastRides.length > 0 ? (
            pastRides.map((ride,index) => <PrevRideCard key={index} ride={ride} />)
          ) : (
            <h1>No Past Rides</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default PastRides;
