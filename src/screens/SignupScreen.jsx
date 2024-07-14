import React, { useEffect } from "react";
import { SignUp } from "@clerk/clerk-react";
import "../styles/signup.css";
import { useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

const SignupScreen = () => {
  const navigate = useNavigate();
  const user = useUser();
  useEffect(() => {
    if (user.isSignedIn) {
      navigate("/home");
    }
  }, []);
  const handleAfterSignUp = async () => {
    const clerk = useClerk();
    try {
      const metamaskid = await clerk.user.getMetadata("metamaskid");
      await clerk.signIn({
        email: clerk.signupFields.email,
        password: clerk.signupFields.password,
        metadata: { metamaskid },
      });
      console.log(metamaskid);
      navigate("/home");
    } catch (e) {
      console.error("Sign in or Sign up failed : ", e);
    }
  };
  return (
    <div className="signup-container">
      <h1 className="pg-heading kanit-bold">Sign up Page</h1>
      <SignUp
        afterSignUp={handleAfterSignUp}
        afterSignInUrl="/home"
        afterSignUpUrl="/home"
      />
    </div>
  );
};

export default SignupScreen;
