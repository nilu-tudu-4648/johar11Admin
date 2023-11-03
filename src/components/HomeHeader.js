import { View } from "react-native";
import React from "react";
import AppHeader from "./AppHeader";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { NAVIGATION } from "../constants/routes";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import AppText from "./AppText";
import { useSelector } from "react-redux";
import { Image } from "react-native";
const HomeHeader = ({ style, iconColor, header, headerColor = "" }) => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.entities.userReducer);

  return (
    <AppHeader
      iconColor={iconColor}
      style={[
        {
          height: SIZES.height / 7,
          justifyContent: "center",
        },
        style,
      ]}
    >
      <View style={{ ...FSTYLES }}>
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="reorder-three-sharp"
          size={SIZES.largeTitle * 0.8}
          color={iconColor ? iconColor : COLORS.white}
        />
        {header ? (
          <AppText
            bold={true}
            color={headerColor ? headerColor : COLORS.white}
            size={2}
          >
            {header}
          </AppText>
        ) : null}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(NAVIGATION.PROFILE, {
              admin: user.admin === "true" ? true : false,
            })
          }
        >
          <FontAwesome5
            name="user-circle"
            size={SIZES.largeTitle * 0.6}
            color={iconColor ? iconColor : COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </AppHeader>
  );
};

export default HomeHeader;
