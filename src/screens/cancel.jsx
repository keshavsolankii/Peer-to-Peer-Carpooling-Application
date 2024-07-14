import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";

function Cancel() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/bookride", { replace: true });
    }, 10000);
  }, []);
  return (
    <div>
      <AppNav />
      <div style={{ textAlign: "center", marginTop: "15rem" }}>
        <h1>Payment Cancelled !!</h1>
      </div>
    </div>
  );
}

export default Cancel;
