import React, { useEffect } from "react";
import "../styles/signin.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  SignIn,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import HomeScreen from "./HomeScreen";
const Signin = () => {
  const navigate = useNavigate();
  const user = useUser();
  useEffect(() => {
    if (user.isSignedIn) {
      navigate("/home");
    }
  }, []);
  const handleAfterSignIn = () => {
    navigate("/home");
  };
  return (
    <div className="signinscreen-container">
      <SignedOut>
        <div className="signin-container">
          <SignIn afterSignUpUrl="/home" afterSignInUrl="/home" />
        </div>
      </SignedOut>
    </div>
  );
};

export default Signin;
