import React from "react";
import { Text } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { COLORS } from "../constants/theme";

const AppText = ({ children, style, size, bold = false, color }) => {
  return (
    <Text
      style={[
        {
          color: color ? color : COLORS.lightgray2,
          fontWeight: bold ? "700" : "400",
          fontFamily: "Inter-Medium",
          fontSize: responsiveFontSize(size ? size : 2),
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export default React.memo(AppText);
