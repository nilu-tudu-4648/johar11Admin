import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMatch,
  getAllMatches,
} from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
const AllTournaments = ({ navigation }) => {
  const { allMatches } = useSelector((state) => state.entities.adminReducer);
  const [loading, setloading] = useState(true);
  const [editPlayerVisible, seteditPlayerVisible] = useState(false);
  const [editPlayerItem, seteditPlayerItem] = useState({});
  const [data, setData] = useState([]);
  const [query, setquery] = useState("");
  const dispatch = useDispatch();
  const filterFunction = useMemo(() => {
    return (item) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        item.firstTeamName?.toLowerCase().includes(lowercaseQuery) ||
        item.secondTeamName?.toLowerCase().includes(lowercaseQuery)
      );
    };
  }, [query]);

  const filterData = useCallback(() => {
    if (query) {
      const filteredData = allMatches.filter(filterFunction);
      setData(filteredData);
    } else {
      setData(allMatches);
    }
  }, [query, allMatches, filterFunction]);
  useEffect(() => {
    getAllMatches(dispatch, setloading); // Assuming this function fetches data and sets it in Redux store
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [query, allMatches, filterFunction, filterData]);
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(NAVIGATION.ADMIN_HOME);
      return () => true;
    },
    []
  );
  const openDialog = (item) => {
    seteditPlayerItem(item);
    seteditPlayerVisible(true);
  };
  return (
    <>
      <AppLoader loading={loading} />
      <HomeHeader header={"ALL MATCHES"} />
      <AppView>
        <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={'Search by Team Name'}
        />
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data?.map((item, i) => (
            <View key={i} style={styles.card}>
              <View style={{ ...FSTYLES}}>
                <AppText bold={true}>{item.firstTeamName}</AppText>
                <AppText bold={true}>vs</AppText>
                <AppText color={"red"}>{item.secondTeamName}</AppText>
              </View>
              <AppButton
                onPress={() =>
                  deleteMatch(item.id, getAllMatches(dispatch, setloading))
                }
                title={"Delete"}
                style={{ width: "48%", backgroundColor: COLORS.gray }}
              />
            </View>
          ))}
        </ScrollView>
        {/* <EditPlayerDialog
          item={editPlayerItem}
          visible={editPlayerVisible}
          setvisible={seteditPlayerVisible}
          callGetAllplayer={callGetAllplayer}
        /> */}
      </AppView>
    </>
  );
};

export default AllTournaments;

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: SIZES.base,
    width: "99%",
    height: SIZES.height * 0.15,
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 10,
  },
});
