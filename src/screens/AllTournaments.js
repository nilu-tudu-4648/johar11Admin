import { BackHandler, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
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
  markItcomplete,
} from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { Image } from "react-native";
const AllTournaments = ({ navigation }) => {
  const { allMatches } = useSelector((state) => state.entities.adminReducer);
  const [loading, setloading] = useState(true);
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
  const getMatch = () => {
    getAllMatches(dispatch, setloading);
  };
  useEffect(() => {
    getMatch();
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

  return (
    <>
      <AppLoader loading={loading} />
      <HomeHeader header={"ALL MATCHES"} />
      <AppView>
        <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={"Search by Team Name"}
        />
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data?.map((item, i) => (
            <TouchableOpacity key={i} onPress={()=>navigation.navigate(NAVIGATION.PRIZE_DISTRIBUTION,{item})} style={{...styles.card,backgroundColor:item.isTesting==='true' ?'gray':'white' }}>
              <View style={{ ...FSTYLES}}>
                <AppText size={1.5}>Entry: {item.entryFees}</AppText>
                <AppText size={1.5}>Prize: {item.prizeAmount}</AppText>
              </View>
              <View style={{ ...FSTYLES }}>
                <View>
                {
                  item.captain1Pic?
                  <Image
                  source={{ uri: item.captain1Pic }}
                  style={{ width: 50, height: 50 }}
                /> : <View style={{ width: 50, height: 50,backgroundColor:'red' }}/>
                }
                  <AppText bold={true}>{item.firstTeamName}</AppText>
                </View>
                <AppText bold={true}>vs</AppText>
                <View>
                {
                  item.captain2Pic?
                  <Image
                  source={{ uri: item.captain2Pic }}
                  style={{ width: 50, height: 50 }}
                /> : <View style={{ width: 50, height: 50,backgroundColor:'green' }}/>
                }
                  <AppText color={COLORS.primary}>
                    {item.secondTeamName}
                  </AppText>
                </View>
              </View>
              <View style={{ ...FSTYLES }}>
                <AppText size={1.5}>{item.date}</AppText>
                <AppText size={1.5}>{item.time}</AppText>
                <AppText color={"red"} size={1.5}>
                  {item.status}
                </AppText>
              </View>
              <View style={{ ...FSTYLES }}>
                <AppText size={1.5}>{item.eventLocation}</AppText>
                <AppText size={1.5}>{item.eventName}</AppText>
              </View>
              <View style={{ ...FSTYLES }}>
                <AppButton
                  varient={"outlined"}
                  borderColor={COLORS.red}
                  onPress={() => deleteMatch(item.id, getMatch)}
                  title={"Delete"}
                  style={{ width: "48%" }}
                />
                <AppButton
                  varient={"outlined"}
                  onPress={() =>
                    markItcomplete({ ...item, status: "completed" }, getMatch)
                  }
                  title={"Complete"}
                  style={{ width: "48%" }}
                />
              </View>
            </TouchableOpacity>
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
    borderRadius: 10,
    padding: SIZES.base,
    width: "99%",
    justifyContent: "space-between",
    alignSelf: "center",
    marginVertical: 10,
  },
});
