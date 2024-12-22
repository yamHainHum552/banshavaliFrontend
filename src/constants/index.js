// import arrowDown from "@/assets/icons/arrow-down.png";
// import arrowUp from "@/assets/icons/arrow-up.png";
// import backArrow from "@/assets/icons/back-arrow.png";
// import chat from "../../assets/icons/chat.png";
// import checkmark from "@/assets/icons/check.png";
// import close from "@/assets/icons/close.png";
// import dollar from "@/assets/icons/dollar.png";
// import email from "@/assets/icons/email.png";
// import eyecross from "@/assets/icons/eyecross.png";
// import google from "@/assets/icons/google.png";
// import home from "@/assets/icons/home.png";
// import list from "@/assets/icons/list.png";
// import lock from "@/assets/icons/lock.png";
// import map from "@/assets/icons/map.png";
// import marker from "@/assets/icons/marker.png";
// import out from "@/assets/icons/out.png";
// import person from "@/assets/icons/person.png";
// import pin from "@/assets/icons/pin.png";
// import point from "@/assets/icons/point.png";
// import profile from "@/assets/icons/profile.png";
// import search from "@/assets/icons/search.png";
// import selectedMarker from "@/assets/icons/selected-marker.png";
// import star from "@/assets/icons/star.png";
// import target from "@/assets/icons/target.png";
// import to from "@/assets/icons/to.png";
// import check from "@/assets/images/check.png";
// import getStarted from "@/assets/images/get-started.png";
// import message from "@/assets/images/message.png";
// import noResult from "@/assets/images/no-result.png";
import onboarding1 from "../assets/images/onboarding1.png";
import onboarding2 from "../assets/images/onboarding2.png";
import onboarding3 from "../assets/images/onboarding3.png";
// import signUpCar from "@/assets/images/signup-car.png";

export const images = {
  onboarding1,
  onboarding2,
  onboarding3,
  // getStarted,
  // signUpCar,
  // check,
  // noResult,
  // message,
};

// export const icons = {
//   arrowDown,
//   arrowUp,
//   backArrow,
//   chat,
//   checkmark,
//   close,
//   dollar,
//   email,
//   eyecross,
//   google,
//   home,
//   list,
//   lock,
//   map,
//   marker,
//   out,
//   person,
//   pin,
//   point,
//   profile,
//   search,
//   selectedMarker,
//   star,
//   target,
//   to,
// };

export const onboarding = [
  {
    id: 1,
    title: "Discover Your Family Heritage",
    description:
      "Uncover the roots of your family tree and explore your ancestral lineage with ease.",
    image: images.onboarding1,
  },
  {
    id: 2,
    title: "Build and Preserve Your Banshavali",
    description:
      "Create, expand, and maintain your family tree for future generations to cherish.",
    image: images.onboarding2,
  },
  {
    id: 3,
    title: "Connect Generations Seamlessly",
    description:
      "Link family members, share stories, and preserve the legacy of your lineage.",
    image: images.onboarding3,
  },
];

export const publicServer = "https://banshavali-backend-7ck2.vercel.app";

export const data = {
  onboarding,
};

// theme.js
export const COLORS = {
  primary: "#007BFF", // Keep this for vibrant accents like buttons or links
  secondary: "#5D4037", // A warm brown to symbolize family roots and tradition
  success: "#4CAF50", // A softer green for success messages and positivity
  danger: "#E53935", // A slightly warmer red for alerts or errors
  warning: "#FFC107", // Keep this for attention-seeking elements
  light: "#FFFBEA",
  dark: "#3E2723",
  background: "#FFCA20",
  text: "#2F2E41",
};
