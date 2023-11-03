import { StyleSheet, Text, } from "react-native";
import React from "react";
import { AppButton, AppView } from "../components";
import { logoutUser } from "../constants/functions";
import { useDispatch } from "react-redux";

const AlertScreen = () => {
    const dispatch = useDispatch();
  return (
    <AppView justify={true}>
      <Text>This feature is not exists in current App</Text>
      <AppButton
        title={"Logout"}
        style={{ width: "100%", marginVertical: 20 }}
        onPress={() => {
          logoutUser(dispatch);
        }}
      />
    </AppView>
  );
};

export default AlertScreen;

const styles = StyleSheet.create({});
