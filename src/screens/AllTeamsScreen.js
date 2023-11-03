import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  AppLoader,
  AppText,
  AppView,
  HomeHeader,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { deleteTeam, getAllTeams } from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, FSTYLES } from "../constants/theme";
import { MaterialIcons } from "@expo/vector-icons";
const AllTeamsScreen = ({ navigation }) => {
  const { allTeams } = useSelector((state) => state.entities.adminReducer);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    getAllTeams(dispatch, setloading);
  }, []);
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(NAVIGATION.ADMIN_HOME);
      return () => true;
    },
    []
  );
  return (
    <>
      <AppLoader loading={loading} />
      <HomeHeader header={"ALL TEAMS"} />
      <AppView>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {allTeams.map((item, i) => (
            <View key={i} style={styles.card}>
              <View>
                <AppText size={1}>{item.id}</AppText>
                <AppText size={2}>{item.teamName}</AppText>
              </View>
              <MaterialIcons
                name="delete"
                onPress={() =>
                  deleteTeam(item.id, getAllTeams(dispatch, setloading))
                }
                size={24}
                color={COLORS.red}
              />
            </View>
          ))}
        </ScrollView>
      </AppView>
    </>
  );
};

export default AllTeamsScreen;

const styles = StyleSheet.create({
  card: {
    ...FSTYLES,
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    width: "99%",
    alignSelf: "center",
    marginVertical: 10,
  },
});
