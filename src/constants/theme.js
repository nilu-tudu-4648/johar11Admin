import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
  // base colors
  primary: "rgba(13, 125, 227, 1)",
  secondary: "rgba(238, 238, 238, 1)",
  background: "rgba(13, 38, 72, 1)",
  // colors
  black: "rgba(0, 0, 0, 1)",
  white: "rgba(255, 255, 255, 1)",
  lightwhite: "rgb(255, 255, 255)",
  lightgray: "rgba(238, 238, 238, 0.5)",
  gray: "rgba(0, 0, 0, 0.4)",
  lightgray1: "lightgray",
  lightgray2: "rgba(0, 0, 0, 0.8)",
  red: "#EB121E",
  green: "#00cc7a",
  lighttext: "rgba(0, 0, 0, 0.5)",
  //others
  transparent: "transparent",
  yellow: "#F1D31A",
  lightyellow: "#FFFCEA",
  purple: "#613DC1",
  purple2: "#858AE3",
  purple3: "#4E148C",
  purple4: "rgba(97, 61, 193, 1)",
  //blue
  blue: "#2E85E0",
  darkblue: "#3399ff",
};

export const STYLES = {
  width: "100%",
  justifyContent: "center",
  alignItems: "center",
};
export const FSTYLES = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};

export const SIZES = {
  // global sizes
  base: width * 0.03,
  base1: width * 0.02,
  base2: width * 0.001,
  font: 14,
  radius: 30,
  padding: width * 0.03,
  padding2: width * 0.05,

  // font sizes
  largeTitle: width * 0.14,
  mediumTitle: width * 0.1,
  h1: width * 0.08,
  h2: width * 0.065,
  h3: width * 0.055,
  h4: width * 0.045,
  h5: width * 0.03,
  h6: width * 0.026,
  h7: width * 0.02,
  // app dimensions
  width,
  height,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.h1,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.09,
  },
  h2: {
    fontSize: SIZES.h2,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.08,
  },
  h3: {
    fontSize: SIZES.h3,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.07,
  },
  h4: {
    fontSize: SIZES.h4,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.06,
  },
  h5: {
    fontSize: SIZES.h5,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.05,
  },
  h6: {
    fontSize: SIZES.h6,
    color: COLORS.black,
    fontWeight: "700",
    lineHeight: width * 0.04,
  },
};
export const NFONTS = {
  h7: { fontSize: width * 0.02, color: COLORS.black, fontWeight: "400" },
  h6: { fontSize: width * 0.03, color: COLORS.black, fontWeight: "400" },
  h5: { fontSize: width * 0.04, color: COLORS.black, fontWeight: "400" },
  h4: { fontSize: width * 0.05, color: COLORS.black, fontWeight: "400" },
  h3: { fontSize: width * 0.06, color: COLORS.black, fontWeight: "400" },
  h2: { fontSize: width * 0.07, color: COLORS.black, fontWeight: "400" },
  h1: { fontSize: width * 0.09, color: COLORS.black, fontWeight: "400" },
};
export const WNFONTS = {
  h7: { fontSize: width * 0.02, color: COLORS.white, fontWeight: "400" },
  h6: { fontSize: width * 0.03, color: COLORS.white, fontWeight: "400" },
  h5: { fontSize: width * 0.04, color: COLORS.white, fontWeight: "400" },
  h4: { fontSize: width * 0.05, color: COLORS.white, fontWeight: "400" },
  h3: { fontSize: width * 0.06, color: COLORS.white, fontWeight: "400" },
  h2: { fontSize: width * 0.07, color: COLORS.white, fontWeight: "400" },
  h1: { fontSize: width * 0.09, color: COLORS.white, fontWeight: "400" },
};

const appTheme = { COLORS, SIZES, WNFONTS, FONTS, NFONTS, STYLES, FSTYLES };

export default appTheme;
