import { StyleSheet, View } from "react-native";
import React from "react";
import { AppText, HomeHeader } from "../components";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { ScrollView } from "react-native";
const PointsSystemScreen = () => {
  const goalArray = [
    { Striker: 60 },
    { Midfielder: 60 },
    { "Defender Or GoalKeeper": 60 },
    { "GoalKeeper Saved": 10 },
    { "Head Goal": 70 },
    { "Cornar Goal": 80 },
    { "Shot on Target": 10 },
    { "Hat rik": 100 },
  ];
  const MinusPoints = [
    { Foul: -7 },
    { "Yellow Card": -10 },
    { "Red Card": -20 },
  ];
  const PenaltyPoints = [
    { Goal: 25 },
    { "Keeper Saved": 25 },
    { "Goal Missed": -10 },
  ];
  const RenderItem = ({ item }) => (
    <View style={{ ...FSTYLES, padding: SIZES.h6 }}>
      <AppText size={1.5}>{Object.keys(item)} :</AppText>
      <AppText size={1.5}>{Object.values(item)}</AppText>
    </View>
  );
  return (
    <>
      <HomeHeader header={"Points System"} />
      <ScrollView
        contentContainerStyle={{
          padding: SIZES.h6,
          backgroundColor: COLORS.white,
        }}
      >
        <AppText style={styles.heading}>Goal Points :-</AppText>
        {goalArray.map((item, i) => (
          <RenderItem item={item} key={i} />
        ))}
        <AppText style={styles.heading}>Minus Points :-</AppText>
        {MinusPoints.map((item, i) => (
          <RenderItem item={item} key={i} />
        ))}
        <AppText style={styles.heading}>Penalty Points :-</AppText>
        {PenaltyPoints.map((item, i) => (
          <RenderItem item={item} key={i} />
        ))}
      </ScrollView>
    </>
  );
};

export default PointsSystemScreen;

const styles = StyleSheet.create({
  heading: {
    marginVertical: SIZES.base,
    color: COLORS.red,
    fontSize: SIZES.base * 1.3,
    fontWeight: "bold",
  },
});
