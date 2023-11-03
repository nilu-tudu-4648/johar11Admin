import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";

const AppHeader = ({
  onPressLeft,
  onPressRight,
  home = false,
  children,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {home ? (
        <>
          <View style={{ width: "33%", alignSelf: "center", paddingLeft: 12 }}>
            <Entypo
              onPress={onPressLeft}
              name="home"
              size={SIZES.h1}
              color={COLORS.gray}
            />
          </View>
          <View style={{ width: "33%" }} />
          <View style={{ width: "33%", alignSelf: "center", paddingLeft: 12 }}>
            <Entypo
              onPress={onPressRight}
              name="home"
              size={SIZES.h1}
              color={COLORS.gray}
            />
          </View>
        </>
      ) : (
        <>{children}</>
      )}
    </View>
  );
};

export default React.memo(AppHeader);

const styles = StyleSheet.create({
  header: {
    height: SIZES.height * 0.2,
    backgroundColor: COLORS.purple,
    paddingHorizontal: SIZES.base,
    alignItems: "center",
  },
});
