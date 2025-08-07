import { BackHandler, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
  EditTournamentDialog,
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

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completed':
      return COLORS.green;
    case 'ongoing':
      return COLORS.primary;
    case 'upcoming':
      return COLORS.yellow;
    case 'cancelled':
      return COLORS.red;
    default:
      return COLORS.gray;
  }
};

const AllTournaments = ({ navigation }) => {
  const { allMatches } = useSelector((state) => state.entities.adminReducer);
  const [loading, setloading] = useState(true);
  const [data, setData] = useState([]);
  const [query, setquery] = useState("");
  const [editTournamentVisible, setEditTournamentVisible] = useState(false);
  const [editTournamentItem, setEditTournamentItem] = useState(null);
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
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {data?.map((item, i) => (
            <TouchableOpacity 
              key={i} 
              onPress={() => navigation.navigate(NAVIGATION.PRIZE_DISTRIBUTION, {item})} 
              style={[
                styles.card,
                { backgroundColor: item.isTesting === 'true' ? COLORS.lightgray : COLORS.white },
                item.status === 'completed' && styles.completedCard
              ]}
            >
              {/* Header with Entry and Prize */}
              <View style={styles.cardHeader}>
                <View style={styles.prizeContainer}>
                  <AppText size={1.2} color={COLORS.lighttext}>Entry</AppText>
                  <AppText size={1.6} bold={true} color={COLORS.black}>{item.entryFees}</AppText>
                </View>
                <View style={styles.prizeContainer}>
                  <AppText size={1.2} color={COLORS.lighttext}>Prize</AppText>
                  <AppText size={1.6} bold={true} color={COLORS.primary}>{item.prizeAmount}</AppText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <AppText size={1.1} color={COLORS.white} bold={true}>
                    {item.status?.toUpperCase()}
                  </AppText>
                </View>
              </View>

              {/* Teams Section */}
              <View style={styles.teamsContainer}>
                <View style={styles.teamSection}>
                  <View style={styles.teamImageContainer}>
                    {item.captain1Pic ? (
                      <Image
                        source={{ uri: item.captain1Pic }}
                        style={styles.teamImage}
                      />
                    ) : (
                      <View style={[styles.teamImage, styles.placeholderImage]}>
                        <AppText color={COLORS.white} size={1.5} bold={true}>
                          {item.firstTeamName?.charAt(0)}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <AppText bold={true} style={styles.teamName} numberOfLines={1}>
                    {item.firstTeamName}
                  </AppText>
                </View>

                <View style={styles.vsContainer}>
                  <AppText bold={true} size={1.8} color={COLORS.primary}>VS</AppText>
                </View>

                <View style={styles.teamSection}>
                  <View style={styles.teamImageContainer}>
                    {item.captain2Pic ? (
                      <Image
                        source={{ uri: item.captain2Pic }}
                        style={styles.teamImage}
                      />
                    ) : (
                      <View style={[styles.teamImage, styles.placeholderImage, { backgroundColor: COLORS.primary }]}>
                        <AppText color={COLORS.white} size={1.5} bold={true}>
                          {item.secondTeamName?.charAt(0)}
                        </AppText>
                      </View>
                    )}
                  </View>
                  <AppText bold={true} style={styles.teamName} numberOfLines={1}>
                    {item.secondTeamName}
                  </AppText>
                </View>
              </View>

              {/* Match Details */}
              <View style={styles.matchDetails}>
                <View style={styles.detailRow}>
                  <AppText size={1.3} color={COLORS.lighttext}>📅 {item.date}</AppText>
                  <AppText size={1.3} color={COLORS.lighttext}>⏰ {item.time}</AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText size={1.3} color={COLORS.lighttext}>📍 {item.eventLocation}</AppText>
                </View>
                <View style={styles.detailRow}>
                  <AppText size={1.3} color={COLORS.lighttext}>🏆 {item.eventName}</AppText>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <AppButton
                  varient={"outlined"}
                  borderColor={COLORS.red}
                  textColor={COLORS.red}
                  onPress={() => deleteMatch(item.id, getMatch)}
                  title={"Delete"}
                  style={styles.actionButton}
                />
                <AppButton
                  varient={"outlined"}
                  borderColor={COLORS.primary}
                  textColor={COLORS.primary}
                  onPress={() => {
                    setEditTournamentItem(item);
                    setEditTournamentVisible(true);
                  }}
                  title={"Edit"}
                  style={styles.actionButton}
                />
                <AppButton
                  varient={item.status === 'completed' ? "filled" : "outlined"}
                  backgroundColor={item.status === 'completed' ? COLORS.green : COLORS.transparent}
                  borderColor={item.status === 'completed' ? COLORS.green : COLORS.green}
                  textColor={item.status === 'completed' ? COLORS.white : COLORS.green}
                  onPress={() =>
                    markItcomplete({ ...item, status: "completed" }, getMatch)
                  }
                  title={item.status === 'completed' ? "Completed" : "Complete"}
                  style={styles.actionButton}
                />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <EditTournamentDialog
          item={editTournamentItem}
          visible={editTournamentVisible}
          setvisible={setEditTournamentVisible}
          callGetAllMatches={getMatch}
        />
      </AppView>
    </>
  );
};

export default AllTournaments;

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 16,
    padding: SIZES.padding,
    width: "95%",
    alignSelf: "center",
    marginVertical: SIZES.base,
    backgroundColor: COLORS.white,
  },
  completedCard: {
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding,
    paddingBottom: SIZES.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgray,
  },
  prizeContainer: {
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base1,
    borderRadius: SIZES.base,
    minWidth: 80,
    alignItems: 'center',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: SIZES.padding,
    paddingVertical: SIZES.base,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamImageContainer: {
    marginBottom: SIZES.base1,
  },
  teamImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.lightgray,
  },
  placeholderImage: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: {
    textAlign: 'center',
    maxWidth: 100,
    fontSize: SIZES.h6,
  },
  vsContainer: {
    backgroundColor: COLORS.lightgray,
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base1,
    borderRadius: SIZES.base,
    marginHorizontal: SIZES.base,
  },
  matchDetails: {
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.base,
    padding: SIZES.base,
    marginVertical: SIZES.base,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.base,
    gap: SIZES.base1,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  scrollView: {
    width: "100%",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.padding,
  },
});
