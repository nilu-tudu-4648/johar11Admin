import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { FSTYLES } from "../constants/theme";
const AllUsersScreen = ({ navigation }) => {
  const { allusers } = useSelector((state) => state.entities.adminReducer);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [query, setquery] = useState("");
  const [data, setData] = useState([]);
  const filterFunction = useMemo(() => {
    return (item) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        item.firstName?.toLowerCase().includes(lowercaseQuery) ||
        item.mobile?.toLowerCase().includes(lowercaseQuery)
      );
    };
  }, [query]);

  const filterData = useCallback(() => {
    if (query) {
      const filteredData = allusers.filter(filterFunction);
      setData(filteredData);
    } else {
      setData(allusers);
    }
  }, [query, allusers, filterFunction]);
  const callGetAllplayer = () => getAllUsers(dispatch, setloading);
  useEffect(() => {
    callGetAllplayer();
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [query, allusers, filterFunction, filterData]);
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
      <HomeHeader header={"ALL USERS"} />
      <AppView>
        <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={"Search by Name or Mobile"}
        />
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item, i) => (
            <View key={i} style={styles.card}>
              <View>
                <AppText size={1.6}>
                  {item.firstName} {item.lastName}
                </AppText>
                <AppText size={1.5}>{item.mobile}</AppText>
              </View>
              <View>
                <AppText size={1.3}>{item.email}</AppText>
              </View>
            </View>
          ))}
        </ScrollView>
      </AppView>
    </>
  );
};

export default AllUsersScreen;

const styles = StyleSheet.create({
  card: {
    ...FSTYLES,
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
});
