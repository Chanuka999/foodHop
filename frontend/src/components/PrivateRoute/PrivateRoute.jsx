import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthonticated = Boolean(localStorage.getItem("loginData"));
  return isAuthonticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
