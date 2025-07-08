import { BackHandler, ScrollView, StyleSheet, View, Platform } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, formatDate } from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { FSTYLES, COLORS, SIZES } from "../constants/theme";
import { Avatar } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

const AllUsersScreen = ({ navigation }) => {
  const { allusers } = useSelector((state) => state.entities.adminReducer);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [query, setquery] = useState("");
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const filterFunction = useMemo(() => {
    return (item) => {
      const lowercaseQuery = query.toLowerCase();
      const matchesSearch =
        item.firstName?.toLowerCase().includes(lowercaseQuery) ||
        item.mobile?.toLowerCase().includes(lowercaseQuery);

      if (!selectedDate) return matchesSearch;

      if (!item.dateJoined) return false;

      const itemDate = new Date(item.dateJoined);
      const matchesDate = isSameDay(itemDate, selectedDate);

      return matchesSearch && matchesDate;
    };
  }, [query, selectedDate]);

  const filterData = useCallback(() => {
    const sorted = [...allusers].sort((a, b) => {
      const dateA = a.dateJoined ? new Date(a.dateJoined) : new Date(0);
      const dateB = b.dateJoined ? new Date(b.dateJoined) : new Date(0);
      return dateB - dateA;
    });

    const finalData = sorted.filter(filterFunction);
    setData(finalData);
  }, [allusers, filterFunction]);

  const callGetAllusers = () => getAllUsers(dispatch, setloading);
  useEffect(() => {
    callGetAllusers();
  }, [dispatch]);

  useEffect(() => {
    filterData();
  }, [query, selectedDate, allusers, filterFunction, filterData]);

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
          <AppButton
            varient={"outlined"}
            title={selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
            onPress={() => setShowDatePicker(true)}
            style={{ width: selectedDate ? '48%' : '100%' }}
          />
          {selectedDate && (
            <AppButton
              varient={"outlined"}
              title={"Clear"}
              onPress={() => setSelectedDate(null)}
              style={{ width: '48%' }}
            />
          )}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (event.type === 'set') {
                setSelectedDate(date);
              }
            }}
          />
        )}
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
        >
          {data.map((item, i) => (
            <View key={i} style={styles.card}>
              {item.profilePic ? (
                <Avatar.Image
                  size={SIZES.largeTitle * 1.7}
                  source={{ uri: item.profilePic }}
                />
              ) : (
                <Avatar.Icon
                  size={SIZES.largeTitle * 1.7}
                  icon="account"
                  style={{ backgroundColor: COLORS.gray }}
                />
              )}
              <View style={FSTYLES}>
                <View>
                  <AppText size={1.6}>
                    {item.firstName} {item.lastName}
                  </AppText>
                  <AppText size={1.5}>{item.mobile}</AppText>
                </View>
                <View>
                  <AppText size={1.3}>{item.email}</AppText>
                  {item.dateJoined && (
                    <AppText size={1.2} color={COLORS.gray}>
                      Joined: {formatDate(new Date(item.dateJoined))}
                    </AppText>
                  )}
                </View>
              </View>
              <AppButton
                varient={"outlined"}
                borderColor={COLORS.red}
                onPress={() => deleteUser(item.id, callGetAllusers)}
                title={"Delete"}
                style={{ width: "48%" }}
              />
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
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
});
