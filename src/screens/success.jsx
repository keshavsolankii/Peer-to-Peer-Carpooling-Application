import React, { useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Success() {
  // const videoRef = useRef(null);
  const { driverid, userid, passengerCount } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("paid api called");
    axios
      .post("http://localhost:9000/offeredRide/paid", {
        metaid: driverid,
        userid: userid,
        passengerCount: passengerCount,
      })
      .then((res) => {
        console.log("saveRide api called");
        axios.post("http://localhost:9000/saveRide", {
          metaid: userid,
          drivername: res.data.drivername,
          driverContact: res.data.drivercontact,
          passengerCount: res.data.offer.passengerCount,
          source: res.data.offer.usrsrc,
          dest: res.data.offer.usrdst,
          amountPaid: res.data.offer.offeredamt,
          carNumber: res.data.carNumber,
        });
      });

    setTimeout(() => {
      navigate('/bookride', { replace: true });
    }, 10000);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "15rem" }}>
      <h1>Payment Succes : {")"}</h1>
      {/* <video style={{margin:'3rem'}} ref={videoRef} width="640" height="360" controls autoPlay loop>
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>
  );
}
export default Success;
