import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/homescreen.css";

const AppNav = () => {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <div
        className="company-name"
        data-aos="slide-left"
        onClick={() => navigate("/home", { replace: "true" })}
      >
        Ether Shuttle
      </div>
      <div
        className="rightNav"
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        <div className="nav-links" data-aos="slide-right">
          <NavLink to="/offers" className="nav-link">
            Offers
          </NavLink>
          <NavLink to="/pastRides" className="nav-link">
            PrevRides
          </NavLink>
          <NavLink to="/offered" className="nav-link">
            Offered
          </NavLink>
        </div>
        <div className="user-button-container" data-aos="slide-right">
          <UserButton
            showName={true}
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonOuterIdentifier: {
                  color: "white",
                  fontSize: "2rem",
                  textTransform: "none",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AppNav;
