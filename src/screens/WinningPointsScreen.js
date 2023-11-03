import { StyleSheet, View } from "react-native";
import React from "react";
import { AppText, AppView } from "../components";
import { COLORS, SIZES, STYLES } from "../constants/theme";
import { Entypo } from "@expo/vector-icons";
import ContestHeader from "../components/ContestHeader";
const WinningPointsScreen = ({ route }) => {
  const { selectedTeam, playersArray } = route.params;
  const renderPlayers = (playerType, header) => {
    return (
      <>
        <AppText bold={true} color={COLORS.white} size={1.5}>
          {header}
        </AppText>
        <View style={styles.optionsContainer}>
          {playersArray
            .filter((player) => player.playerType === playerType)
            .map((item) => (
              <View key={item.name} style={{ alignItems: "center" }}>
                <Entypo name="user" size={SIZES.h1 * 1.3} color="black" />
                <AppText color={COLORS.white} size={1.4}>
                  {item.name}
                </AppText>
                <AppText color={COLORS.white} size={1.3} bold={true}>
                  {item.points}
                </AppText>
              </View>
            ))}
        </View>
      </>
    );
  };
  return (
    <>
      <ContestHeader />
      <AppView>
        <AppText bold={true} style={{ alignSelf: "center" }} size={2}>
          {selectedTeam.userName}
        </AppText>
        <View style={styles.viewContainer}>
          {renderPlayers("GK", "Goal Keeper")}
          {renderPlayers("DEF", "Defenders")}
          {renderPlayers("MID", "Midfielders")}
          {renderPlayers("ST", "Strikers")}
        </View>
      </AppView>
    </>
  );
};

export default WinningPointsScreen;

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: SIZES.h7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },

  viewContainer: {
    ...STYLES,
    height: "100%",
    backgroundColor: COLORS.green,
    justifyContent: "space-around",
  },
});
