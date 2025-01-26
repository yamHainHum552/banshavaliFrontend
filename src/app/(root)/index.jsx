import React from "react";
import { Redirect } from "expo-router";

const Welcome = () => {
  return <Redirect href="/(tabs)/home" />;
};

export default Welcome;
