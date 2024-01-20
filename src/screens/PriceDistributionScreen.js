import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, View, StyleSheet, TouchableOpacity } from "react-native";
import { AppSearchBar, AppText, AppView, PrizeAmountDialog } from "../components";
import { getCreatedteamsbymatchId } from "../constants/functions";
import { FSTYLES, SIZES } from "../constants/theme";

const PriceDistributionScreen = ({ route }) => {
  const { item } = route.params;
  const [names, setNames] = useState([]);
  const [dialogVisible, setdialogVisible] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [query, setquery] = useState("");
  const [data, setData] = useState("");
  const callGetAllcreatedTeams = async () => {
    try {
      await getCreatedteamsbymatchId(setNames, item.id,true);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    callGetAllcreatedTeams();
  }, [item.id]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => openDialog(item)} style={FSTYLES}>
      <AppText>{item.name}</AppText>
      <AppText>₹ {item.prizeAmount} </AppText>
    </TouchableOpacity>
  );
  const openDialog = (item) => {
    setEditItem(item);
    setdialogVisible(true);
  };
  const filterFunction = useMemo(() => {
    return (item) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        item.name?.toLowerCase().includes(lowercaseQuery)
      );
    };
  }, [query]);

  const filterData = useCallback(() => {
    if (query) {
      const filteredData = names.filter(filterFunction);
      setData(filteredData);
    } else {
      setData(names);
    }
  }, [query, names, filterFunction]);

  useEffect(() => {
    filterData();
  }, [query, names, filterFunction, filterData]);
  return (
    <AppView>
           <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={'Search by "Name'}
        />
      <View style={{ ...FSTYLES, marginBottom: SIZES.base }}>
        <AppText bold={true} size={2.5}>
          {"Names"}
        </AppText>
        <AppText bold={true} size={2.5}>
          {"Prize Amount"}
        </AppText>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item,index) => index}
      />
      <PrizeAmountDialog
        item={editItem}
        visible={dialogVisible}
        setvisible={setdialogVisible}
        callGetAllplayer={callGetAllcreatedTeams}
        matchId={item.id}
        names={names}
        setNames={setNames}
      />
    </AppView>
  );
};

export default PriceDistributionScreen;

// Use or remove this
const styles = StyleSheet.create({});
