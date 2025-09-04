import { BackHandler, FlatList, StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  AppButton,
  AppLoader,
  AppSearchBar,
  AppText,
  AppView,
  HomeHeader,
  OptimizedImage,
  UserDetailsDialog,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers, getAllUsersPage, formatDate } from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { COLORS, SIZES } from "../constants/theme";
import { Avatar } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';

const AllUsersScreen = ({ navigation }) => {
  const { allusers } = useSelector((state) => state.entities.adminReducer);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setquery] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Pagination state
  const [currentUsers, setCurrentUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const PAGE_SIZE = 20;

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

  const filteredAndSortedData = useMemo(() => {
    if (!currentUsers || currentUsers.length === 0) return [];
    
    const filtered = currentUsers.filter(filterFunction);
    
    // Sort by dateJoined (newest first) since Firebase query orders by document ID
    return filtered.sort((a, b) => {
      const dateA = a.dateJoined ? new Date(a.dateJoined) : new Date(0);
      const dateB = b.dateJoined ? new Date(b.dateJoined) : new Date(0);
      return dateB - dateA;
    });
  }, [currentUsers, filterFunction]);

  const callGetAllusers = useCallback(() => getAllUsers(dispatch, setloading), [dispatch]);

  // Load initial users with pagination
  const loadInitialUsers = useCallback(async () => {
    try {
      setloading(true);
      const result = await getAllUsersPage({ pageSize: PAGE_SIZE });
      setCurrentUsers(result.users);
      setLastVisible(result.lastVisible);
      setHasNextPage(result.hasNextPage);
      setTotalUsersCount(allusers?.length || 0); // Keep total count from Redux for display
    } catch (error) {
      console.error('Error loading initial users:', error);
    } finally {
      setloading(false);
    }
  }, [allusers?.length, PAGE_SIZE]);

  // Load more users
  const loadMoreUsers = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const result = await getAllUsersPage({ 
        pageSize: PAGE_SIZE, 
        lastVisible: lastVisible 
      });
      
      setCurrentUsers(prev => [...prev, ...result.users]);
      setLastVisible(result.lastVisible);
      setHasNextPage(result.hasNextPage);
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [hasNextPage, loadingMore, lastVisible, PAGE_SIZE]);

  // Refresh users
  const refreshUsers = useCallback(async () => {
    try {
      setRefreshing(true);
      const result = await getAllUsersPage({ pageSize: PAGE_SIZE });
      setCurrentUsers(result.users);
      setLastVisible(result.lastVisible);
      setHasNextPage(result.hasNextPage);
      // Also refresh the Redux store for total count
      await getAllUsers(dispatch, () => {});
    } catch (error) {
      console.error('Error refreshing users:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, PAGE_SIZE]);
  
  const handleUserPress = useCallback((user) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  }, []);
  
  useEffect(() => {
    // Load both total count (Redux) and initial paginated data
    callGetAllusers();
    loadInitialUsers();
  }, [callGetAllusers, loadInitialUsers]);

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

  const handleDeleteUser = useCallback(async (userId) => {
    try {
      await deleteUser(userId, callGetAllusers);
      // Refresh paginated data after deletion
      await refreshUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }, [callGetAllusers, refreshUsers]);

  const renderUserItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleUserPress(item)} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        {item.profilePic ? (
          <OptimizedImage
            source={{ uri: item.profilePic }}
            style={styles.avatar}
            placeholder={
              <Avatar.Icon
                size={SIZES.largeTitle * 1.4}
                icon="account"
                style={{ backgroundColor: COLORS.gray }}
              />
            }
          />
        ) : (
          <Avatar.Icon
            size={SIZES.largeTitle * 1.4}
            icon="account"
            style={{ backgroundColor: COLORS.gray }}
          />
        )}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.userInfo}>
          <AppText size={1.6} style={styles.userName}>
            {item.firstName} {item.lastName}
          </AppText>
          <AppText size={1.4} color={COLORS.primary}>
            {item.mobile}
          </AppText>
          <AppText size={1.3} color={COLORS.gray}>
            {item.email}
          </AppText>
          {item.dateJoined && (
            <AppText size={1.2} color={COLORS.gray}>
              Joined: {formatDate(new Date(item.dateJoined))}
            </AppText>
          )}
        </View>
      </View>
      <View style={styles.actionContainer}>
        <AppButton
          varient={"outlined"}
          borderColor={COLORS.red}
          onPress={() => handleDeleteUser(item.id)}
          title={"Delete"}
          style={styles.deleteButton}
        />
      </View>
    </TouchableOpacity>
  ), [handleDeleteUser, handleUserPress]);

  return (
    <>
      <AppLoader loading={loading} />
      <HomeHeader header={"ALL USERS"} />
      <AppView>
        <AppSearchBar
          style={{ width: "99%" }}
          onChangeSearch={(text) => setquery(text)}
          searchQuery={query}
          placeholder={"Search in loaded users (Name or Mobile)"}
        />
        
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
        
        {/* User Statistics Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <AppText size={1.4} style={styles.summaryTitle}>Dashboard Overview</AppText>
              <View style={styles.headerButtons}>
                {selectedDate && (
                  <AppButton
                    varient={"text"}
                    title={"Clear Filter"}
                    onPress={() => setSelectedDate(null)}
                    style={[styles.changeDateButton, { backgroundColor: COLORS.gray + '15', marginRight: 8 }]}
                    titleStyle={[styles.changeDateText, { color: COLORS.gray }]}
                  />
                )}
                <AppButton
                  varient={"text"}
                  title={"Filter by Date"}
                  onPress={() => setShowDatePicker(true)}
                  style={styles.changeDateButton}
                  titleStyle={styles.changeDateText}
                />
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <AppText size={1.2} color={COLORS.gray}>
                  {selectedDate ? 'Filter Date' : 'Today'}
                </AppText>
                <AppButton
                  varient={"text"}
                  title={`${selectedDate ? selectedDate.toLocaleDateString() : new Date().toLocaleDateString()} 📅`}
                  onPress={() => setShowDatePicker(true)}
                  style={styles.dateButton}
                  titleStyle={[
                    styles.summaryValue,
                    selectedDate && { color: COLORS.primary }
                  ]}
                />
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <AppText size={1.2} color={COLORS.gray}>Total Users</AppText>
                <AppText size={1.6} style={styles.summaryValue}>
                  {allusers?.length || totalUsersCount || 0}
                </AppText>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <AppText size={1.2} color={COLORS.gray}>
                  {selectedDate ? 'Filtered' : 'Loaded'}
                </AppText>
                <AppText size={1.6} style={[
                  styles.summaryValue,
                  selectedDate && { color: COLORS.primary }
                ]}>
                  {selectedDate ? filteredAndSortedData.length : currentUsers.length}
                </AppText>
              </View>
            </View>
          </View>
        </View>
        
        <FlatList
          data={filteredAndSortedData}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={10}
          removeClippedSubviews={true}
          refreshing={refreshing}
          onRefresh={refreshUsers}
          onEndReached={query || selectedDate ? null : loadMoreUsers}
          onEndReachedThreshold={0.3}
          ListFooterComponent={() => {
            if (loadingMore) {
              return (
                <View style={styles.footerLoader}>
                  <AppText size={1.3} color={COLORS.gray}>Loading more users...</AppText>
                </View>
              );
            }
            if (!hasNextPage && currentUsers.length > 0 && !query && !selectedDate) {
              return (
                <View style={styles.footerLoader}>
                  <AppText size={1.3} color={COLORS.gray}>No more users to load</AppText>
                </View>
              );
            }
            return null;
          }}
          getItemLayout={(data, index) => ({
            length: 156, // card height (140) + marginVertical (8*2)
            offset: 156 * index,
            index,
          })}
        />
      </AppView>
      
      <UserDetailsDialog 
        visible={showUserDialog}
        setVisible={setShowUserDialog}
        user={selectedUser}
      />
    </>
  );
};

export default AllUsersScreen;

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 5,
    height: 140, // Increased height for better content display
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: SIZES.largeTitle * 1.4,
    height: SIZES.largeTitle * 1.4,
    borderRadius: (SIZES.largeTitle * 1.4) / 2,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  deleteButton: {
    width: 80,
    height: 36,
    paddingHorizontal: 10,
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.lightgray,
    marginHorizontal: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgray,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  changeDateButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.primary + '15',
    width: 80,
  },
  changeDateText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dateButton: {
    padding: 0,
    minHeight: 0,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
