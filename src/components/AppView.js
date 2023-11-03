import React from "react";
import { SafeAreaView, StyleSheet, View, StatusBar } from "react-native";
import { COLORS, SIZES } from "../constants/theme";
import Constants from "expo-constants";

const AppView = ({ children, style, justify }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent"  />
      <SafeAreaView style={[styles.screen]}>
        <View style={[styles.view, style, justify && { justifyContent: "center" }]}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightwhite,
  },
  screen: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  view: {
    flex: 1,
    padding: SIZES.base,
  },
});

export default React.memo(AppView);
