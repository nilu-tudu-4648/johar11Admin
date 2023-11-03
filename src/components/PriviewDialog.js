import { StyleSheet, View } from "react-native";
import React from "react";
import { COLORS, SIZES, STYLES } from "../constants/theme";
import { Dialog } from "react-native-paper";
import AppText from "./AppText";
import { Entypo } from "@expo/vector-icons";
const PriviewDialog = ({ visible, setvisible, players }) => {
  const renderPlayers = (playerType, header) => {
    return (
      <>
        <AppText bold={true}>{header}</AppText>
        <View style={styles.optionsContainer}>
          {players
            .filter((player) => player.playerType === playerType)
            .map((item) => (
              <View key={item.id} style={{ alignItems: "center" }}>
                <Entypo name="user" size={SIZES.h1 * 1.3} color="black" />
                <AppText size={1}>{item.name}</AppText>
              </View>
            ))}
        </View>
      </>
    );
  };
  return (
    <Dialog
      visible={visible}
      onDismiss={() => setvisible(false)}
      style={styles.modalContainer}
    >
      <View style={styles.viewContainer}>
        {renderPlayers("GK", "Goal Keeper")}
        {renderPlayers("DEF", "Defenders")}
        {renderPlayers("MID", "Midfielders")}
        {renderPlayers("ST", "Strikers")}
      </View>
    </Dialog>
  );
};

export default PriviewDialog;

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: SIZES.h7,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },
  modalContainer: {
    width: "90%",
    height: "85%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    paddingTop: 0,
    backgroundColor:COLORS.green,
    alignSelf: "center",
  },
  viewContainer: {
    ...STYLES,
    height: "100%",
    justifyContent: "space-around",
  },
});
