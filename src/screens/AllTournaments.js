import { BackHandler, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
  EditTournamentDialog,
  OptimizedImage,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteMatch,
  getAllMatches,
  markItcomplete,
} from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, FSTYLES, SIZES } from "../constants/theme";
import { selectAllMatches } from "../store/selectors";

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

// Memoized Tournament Item Component for better performance
const TournamentItem = React.memo(({ item, index, navigation, onDelete, onEdit, onComplete }) => (
  <TouchableOpacity 
    key={item.id}
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
          <OptimizedImage
            source={item.captain1Pic ? { uri: item.captain1Pic } : null}
            style={styles.teamImage}
            placeholder={
              <AppText color={COLORS.white} size={1.5} bold={true}>
                {item.firstTeamName?.charAt(0)}
              </AppText>
            }
            placeholderStyle={[styles.teamImage, styles.placeholderImage]}
          />
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
          <OptimizedImage
            source={item.captain2Pic ? { uri: item.captain2Pic } : null}
            style={styles.teamImage}
            placeholder={
              <AppText color={COLORS.white} size={1.5} bold={true}>
                {item.secondTeamName?.charAt(0)}
              </AppText>
            }
            placeholderStyle={[styles.teamImage, styles.placeholderImage, { backgroundColor: COLORS.primary }]}
          />
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
        onPress={() => onDelete(item.id)}
        title={"Delete"}
        style={styles.actionButton}
      />
      <AppButton
        varient={"outlined"}
        borderColor={COLORS.primary}
        textColor={COLORS.primary}
        onPress={() => onEdit(item)}
        title={"Edit"}
        style={styles.actionButton}
      />
      <AppButton
        varient={item.status === 'completed' ? "filled" : "outlined"}
        backgroundColor={item.status === 'completed' ? COLORS.green : COLORS.transparent}
        borderColor={item.status === 'completed' ? COLORS.green : COLORS.green}
        textColor={item.status === 'completed' ? COLORS.white : COLORS.green}
        onPress={() => onComplete({ ...item, status: "completed" })}
        title={item.status === 'completed' ? "Completed" : "Complete"}
        style={styles.actionButton}
      />
    </View>
  </TouchableOpacity>
));

const AllTournaments = ({ navigation }) => {
  const allMatches = useSelector(selectAllMatches);
  const [loading, setloading] = useState(true);
  const [query, setquery] = useState("");
  const [editTournamentVisible, setEditTournamentVisible] = useState(false);
  const [editTournamentItem, setEditTournamentItem] = useState(null);
  const dispatch = useDispatch();
  
  // Memoized filter function
  const filterFunction = useMemo(() => {
    return (item) => {
      const lowercaseQuery = query.toLowerCase();
      return (
        item.firstTeamName?.toLowerCase().includes(lowercaseQuery) ||
        item.secondTeamName?.toLowerCase().includes(lowercaseQuery)
      );
    };
  }, [query]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    if (query) {
      return allMatches.filter(filterFunction);
    }
    return allMatches;
  }, [query, allMatches, filterFunction]);

  // Memoized callback functions
  const getMatch = useCallback(() => {
    getAllMatches(dispatch, setloading);
  }, [dispatch]);

  const handleDelete = useCallback((id) => {
    deleteMatch(id, getMatch);
  }, [getMatch]);

  const handleEdit = useCallback((item) => {
    setEditTournamentItem(item);
    setEditTournamentVisible(true);
  }, []);

  const handleComplete = useCallback((item) => {
    markItcomplete(item, getMatch);
  }, [getMatch]);

  const renderItem = useCallback(({ item, index }) => (
    <TournamentItem
      item={item}
      index={index}
      navigation={navigation}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onComplete={handleComplete}
    />
  ), [navigation, handleDelete, handleEdit, handleComplete]);

  const keyExtractor = useCallback((item) => item.id, []);

  useEffect(() => {
    getMatch();
  }, [getMatch]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.navigate(NAVIGATION.ADMIN_HOME);
        return true;
      }
    );
    
    return () => backHandler.remove();
  }, [navigation]);

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
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          getItemLayout={(data, index) => ({
            length: 220, // Approximate height of each item
            offset: 220 * index,
            index,
          })}
        />
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
