import React from "react";
import Navbar from "../NavBar/NavBar";

const DefaultComponent = ({
  children,
  isAuthentication,
  handleAuthentication,
}) => {
  return (
    <div>
      <Navbar
        isAuthentication={isAuthentication}
        handleAuthentication={handleAuthentication}
      />
      {children}
    </div>
  );
};

export default DefaultComponent;
