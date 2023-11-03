import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { AppDivider, AppText } from ".";
const CreateTeamItemComponent = ({ item, addPlayerstoTeamFunc }) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => addPlayerstoTeamFunc(item)}
        style={{
          ...FSTYLES,
          padding: SIZES.base * 2,
          backgroundColor: item.isActive ? COLORS.lightgray : COLORS.white,
        }}
      >
        <View style={{ width: "25%" }}>
          <Entypo name="user" size={SIZES.h1 * 1.5} color="black" />
        </View>
        <View style={{ width: "30%" }}>
          <AppText size={1.8} bold={true}>
            {item.name}
          </AppText>
          <AppText size={1.5} color={COLORS.lightgray2}>
            {item.teamName}
          </AppText>
        </View>
        <View
          style={{
            width: "40%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <AppText></AppText>
          <AppText size={1.4}>{item.points}</AppText>
          <Feather
            name={item.isActive ? "minus-circle" : "plus-circle"}
            size={SIZES.h1 * 0.8}
            color={item.isActive ? COLORS.red : COLORS.green}
          />
        </View>
      </TouchableOpacity>
      <AppDivider />
    </>
  );
};

export default React.memo(CreateTeamItemComponent);
