import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback } from "react";
import { AppText, AppView, HomeHeader } from "../components";
import { dashboardCards } from "../constants/data";
import { COLORS, SIZES, STYLES } from "../constants/theme";

// Memoized Dashboard Card Component
const DashboardCard = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.kpiCard]}
  >
    <AppText bold={true} size={1.5}>
      {item.name}
    </AppText>
  </TouchableOpacity>
));

const AdminHomeScreen = ({ navigation }) => {
  const handleCardPress = useCallback((navigationRoute) => {
    navigation.navigate(navigationRoute);
  }, [navigation]);

  return (
    <>
      <HomeHeader header={"HOME"} />
      <AppView>
        <View style={styles.cardContainer}>
          {dashboardCards.map((item, i) => (
            <DashboardCard
              key={item.navigation}
              item={item}
              onPress={() => handleCardPress(item.navigation)}
            />
          ))}
        </View>
      </AppView>
    </>
  );
};

export default AdminHomeScreen;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    paddingLeft: SIZES.base,
  },
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
