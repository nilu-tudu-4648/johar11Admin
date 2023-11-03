import { StyleSheet, View } from "react-native";
import React from "react";
import { COLORS } from "../constants/theme";

const AppDivider = () => {
  return (
    <View
      style={{
        width: "100%",
        borderTopColor: COLORS.lightgray1,
        borderTopWidth: 0.4,
      }}
    />
  );
};

export default AppDivider;

const styles = StyleSheet.create({});
