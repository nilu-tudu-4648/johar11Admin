import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { AppText, AppView, HomeHeader } from "../components";
import { dashboardCards } from "../constants/data";
import { COLORS, SIZES, STYLES } from "../constants/theme";
const AdminHomeScreen = ({ navigation }) => {
  return (
    <>
      <HomeHeader header={"HOME"} />
      <AppView>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            width: "100%",
            paddingLeft: SIZES.base,
          }}
        >
          {dashboardCards.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(item.navigation)}
              style={[styles.kpiCard]}
            >
              <AppText bold={true} size={1.5}>
                {item.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </AppView>
    </>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  kpiCard: {
    ...STYLES,
    margin: SIZES.base1,
    height: SIZES.width / 3.4,
    borderRadius: SIZES.base,
    width: SIZES.width / 3.9,
    backgroundColor: COLORS.white,
    elevation: SIZES.base1,
  },
});
