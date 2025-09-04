import { StyleSheet, View, ScrollView } from "react-native";
import React from "react";
import { COLORS, SIZES } from "../constants/theme";
import { Dialog } from "react-native-paper";
import { Avatar } from "react-native-paper";
import AppText from "./AppText";
import AppButton from "./AppButton";
import OptimizedImage from "./OptimizedImage";
import { formatDate } from "../constants/functions";

const UserDetailsDialog = ({ visible, setVisible, user }) => {
  if (!user) return null;

  return (
    <Dialog
      visible={visible}
      onDismiss={() => setVisible(false)}
      style={styles.modalContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <AppText bold={true} size={1.8} style={styles.title}>
            User Details
          </AppText>
          
          {/* User Avatar */}
          <View style={styles.avatarContainer}>
            {user.profilePic ? (
              <OptimizedImage
                source={{ uri: user.profilePic }}
                style={styles.largeAvatar}
                placeholder={
                  <Avatar.Icon
                    size={80}
                    icon="account"
                    style={{ backgroundColor: COLORS.gray }}
                  />
                }
              />
            ) : (
              <Avatar.Icon
                size={80}
                icon="account"
                style={{ backgroundColor: COLORS.gray }}
              />
            )}
          </View>
        </View>

        {/* User Information */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <AppText size={1.4} style={styles.label}>Name:</AppText>
            <AppText size={1.4} style={styles.value}>
              {user.firstName} {user.lastName}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText size={1.4} style={styles.label}>Mobile:</AppText>
            <AppText size={1.4} style={styles.value}>
              {user.mobile || "Not provided"}
            </AppText>
          </View>

          <View style={styles.infoRow}>
            <AppText size={1.4} style={styles.label}>Email:</AppText>
            <AppText size={1.4} style={styles.value}>
              {user.email || "Not provided"}
            </AppText>
          </View>

          {user.dateJoined && (
            <View style={styles.infoRow}>
              <AppText size={1.4} style={styles.label}>Date Joined:</AppText>
              <AppText size={1.4} style={styles.value}>
                {formatDate(new Date(user.dateJoined))}
              </AppText>
            </View>
          )}

          {user.city && (
            <View style={styles.infoRow}>
              <AppText size={1.4} style={styles.label}>City:</AppText>
              <AppText size={1.4} style={styles.value}>
                {user.city}
              </AppText>
            </View>
          )}

          {user.state && (
            <View style={styles.infoRow}>
              <AppText size={1.4} style={styles.label}>State:</AppText>
              <AppText size={1.4} style={styles.value}>
                {user.state}
              </AppText>
            </View>
          )}

          {user.age && (
            <View style={styles.infoRow}>
              <AppText size={1.4} style={styles.label}>Age:</AppText>
              <AppText size={1.4} style={styles.value}>
                {user.age}
              </AppText>
            </View>
          )}

          <View style={styles.infoRow}>
            <AppText size={1.4} style={styles.label}>User ID:</AppText>
            <AppText size={1.3} style={[styles.value, { fontFamily: 'monospace' }]}>
              {user.id}
            </AppText>
          </View>
        </View>

        <AppButton 
          title="Close" 
          onPress={() => setVisible(false)}
          style={styles.closeButton}
        />
      </ScrollView>
    </Dialog>
  );
};

export default UserDetailsDialog;

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "white",
    alignSelf: "center",
    padding: 20,
    borderRadius: 12,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: COLORS.primary,
    marginBottom: 15,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  largeAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgray,
    marginBottom: 5,
  },
  label: {
    fontWeight: "600",
    color: COLORS.gray,
    flex: 1,
  },
  value: {
    flex: 2,
    textAlign: "right",
    color: COLORS.black,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
  },
});





