import React from "react";
import { Redirect } from "expo-router";
import { useAuth } from "../contexts/authProvider";

const Welcome = () => {
  const { token, user } = useAuth();

  if (token === undefined || user === undefined) {
    return null;
  }

  // Redirect based on authentication state
  if (token) {
    return <Redirect href="/(root)/home" />;
  }
  return <Redirect href="/(auth)/welcome" />;
};

export default Welcome;
