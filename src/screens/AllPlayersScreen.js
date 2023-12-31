import { BackHandler, ScrollView, StyleSheet, View, } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  EditPlayerDialog,
  HomeHeader,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlayers, deletePlayers } from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { Avatar } from "react-native-paper";
const AllPlayersScreen = ({ navigation }) => {
  const { allPlayers } = useSelector((state) => state.entities.adminReducer);
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
        item.teamName?.toLowerCase().includes(lowercaseQuery) ||
        item.name?.toLowerCase().includes(lowercaseQuery)
      );
    };
  }, [query]);

  const filterData = useCallback(() => {
    if (query) {
      const filteredData = allPlayers.filter(filterFunction);
      setData(filteredData);
    } else {
      setData(allPlayers);
    }
  }, [query, allPlayers, filterFunction]);
  const callGetAllplayer = () => getAllPlayers(dispatch, setloading);
  useEffect(() => {
    callGetAllplayer(); // Assuming this function fetches data and sets it in Redux store
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [query, allPlayers, filterFunction, filterData]);

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
      <HomeHeader header={"ALL PLAYERS"} />
      <AppView>
        <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={'Search by "Name" or "Team Name"'}
        />
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data?.map((item, i) => (
            <View key={i} style={styles.card}>
              <View style={{ ...FSTYLES }}>
                {item.playerPic ? (
                  <Avatar.Image
                    size={SIZES.largeTitle * 1.7}
                    source={{ uri: item.playerPic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.largeTitle * 1.7}
                    icon="account"
                    style={{ backgroundColor: COLORS.gray }}
                  />
                )}
                <View style={{ width: "60%", alignItems: "center" }}>
                  <AppText bold={true}>{item.name}</AppText>
                  <AppText color={COLORS.primary}>{item.teamName}</AppText>
                </View>
                <View style={{ width: "20%" }}>
                  <AppText size={1.6}>{item.playerType}</AppText>
                  <AppText color={COLORS.green} size={1.6}>
                    {item.points}
                  </AppText>
                </View>
              </View>
              <View style={{ ...FSTYLES, width: "100%" }}>
                <AppButton
                  varient={"outlined"}
                  title={"Update"}
                  onPress={() => openDialog(item)}
                  style={{ width: "48%" }}
                />
                <AppButton
                  varient={"outlined"}
                  borderColor={COLORS.red}
                  onPress={() => deletePlayers(item.id, callGetAllplayer)}
                  title={"Delete"}
                  style={{ width: "48%" }}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <EditPlayerDialog
          item={editPlayerItem}
          visible={editPlayerVisible}
          setvisible={seteditPlayerVisible}
          callGetAllplayer={callGetAllplayer}
        />
      </AppView>
    </>
  );
};

export default AllPlayersScreen;

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: SIZES.base,
    width: "99%",
    height: SIZES.height * 0.25,
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 10,
  },
});
