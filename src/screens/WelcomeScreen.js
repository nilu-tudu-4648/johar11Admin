import { BackHandler, StyleSheet, View } from "react-native";
import React from "react";
import { AppButton, AppText, AppView } from "../components";
import { SIZES, STYLES } from "../constants/theme";
import { Image } from "react-native";
import { NAVIGATION } from "../constants/routes";

const WelcomeScreen = ({ navigation }) => {
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      BackHandler.exitApp();
      return () => true;
    },
    []
  );
  return (
    <AppView>
      <View
        style={{
          ...STYLES,
          flex: 0.6,
        }}
      >
        <Image
          source={require("../../assets/kick.jpg")}
          style={{ width: "50%", height: 100, resizeMode: "contain" }}
        />
      </View>
      <View
        style={{
          ...STYLES,
          flex: 1,
        }}
      >
        <Image
          source={require("../../assets/teams.png")}
          style={{ width: "100%", resizeMode: "contain", height: "110%" }}
        />
      </View>
      <View
        style={{
          ...STYLES,
          flex: 0.7,
          justifyContent: "space-between",
          paddingVertical: SIZES.padding,
        }}
      >
        <View style={{ ...STYLES }}>
          <AppText size={2.5} bold={true}>
            Create Teams
          </AppText>
          <AppText>Use your skills to pick the right players</AppText>
          <AppText>and earn fantasy points</AppText>
        </View>
        <View
          style={{
            ...STYLES,
            paddingVertical: SIZES.padding,
          }}
        >
          <AppButton
            title="REGISTER"
            style={{ marginVertical: SIZES.h4 }}
            onPress={() =>
              navigation.navigate(NAVIGATION.REGISTER, { register: true })
            }
          />
          <AppButton
            title="LOGIN"
            style={{ marginVertical: SIZES.h4 }}
            onPress={() =>
              navigation.navigate(NAVIGATION.LOGIN, { register: false })
            }
          />
        </View>
      </View>
    </AppView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
