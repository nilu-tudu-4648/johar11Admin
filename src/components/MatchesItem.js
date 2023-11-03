import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { AppText } from "../components";
import { COLORS, FSTYLES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { NAVIGATION } from "../constants/routes";
import { useDispatch } from "react-redux";
import { setselectedTournament } from "../store/userReducer";

const MatchesItem = ({ item, completed }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  return (
    <TouchableOpacity
      onPress={() => {
        dispatch(setselectedTournament(item));
        navigation.navigate(NAVIGATION.MATCH_DETAILS, { item, completed });
      }}
      style={styles.mainContainer}
    >
      <View
        style={{
          ...FSTYLES,
          backgroundColor: COLORS.lightyellow,
          padding: 4,
        }}
      >
        <AppText size={1.5}>Prize {item?.prizeAmount}</AppText>
        <AppText style={{ fontWeight: "400" }} bold={true} size={1.5}>
          {item?.eventName}
        </AppText>
      </View>
      <View
        style={{
          ...FSTYLES,
          paddingHorizontal: 8,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            width: "30%",
          }}
        >
          <View style={{ backgroundColor: "red", height: 20, width: 20 }} />
          <AppText size={1.5} bold={true}>
            {item.firstTeamName}
          </AppText>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AppText size={1.5}>{item.date}</AppText>
          <AppText color={COLORS.primary} size={1.2}>
            {item.time}
          </AppText>
        </View>
        <View
          style={{
            width: "30%",
            alignItems: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "red",
              height: 20,
              width: 20,
            }}
          />
          <AppText size={1.5} bold={true}>
            {item.secondTeamName}
          </AppText>
        </View>
      </View>
      <View
        style={{
          ...FSTYLES,
          padding: 4,
          backgroundColor: COLORS.lightgray,
        }}
      >
        <AppText size={1.5}>{item.eventLocation}</AppText>
        <AppText size={1.5}>{item.eventType}</AppText>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    height: 150,
    width: "99%",
    backgroundColor: COLORS.white,
    borderRadius: 8,
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 8,
    elevation: 5,
  },
});
export default MatchesItem;
