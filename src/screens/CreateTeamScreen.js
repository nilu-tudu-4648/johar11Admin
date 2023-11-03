import { StyleSheet, View } from "react-native";
import React from "react";
import { AppText } from "../components";
import CreateTeamNavigator from "../navigation/CreateTeamNavigator";
import ContestHeader from "../components/ContestHeader";
import { useSelector } from "react-redux";
import { SIZES } from "../constants/theme";

const CreateTeamScreen = () => {
  const { players } = useSelector((state) => state.entities.playersReducer);
  return (
    <View style={{ flex: 1 }}>
      <ContestHeader title={"Create Team"} />
      <AppText style={styles.text} bold={true} size={1.9}>
        Players {players.length}/11
      </AppText>
      <AppText style={styles.text} bold={true} size={1.9}>
        Maximum of 7 players from one team
      </AppText>
      <CreateTeamNavigator />
    </View>
  );
};

export default CreateTeamScreen;

const styles = StyleSheet.create({
  text: {
    marginVertical: SIZES.base1,
  },
});
