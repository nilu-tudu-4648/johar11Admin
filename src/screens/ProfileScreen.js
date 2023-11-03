import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import AppText from "../components/AppText";
import { COLORS, FSTYLES, SIZES, STYLES } from "../constants/theme";
import { Avatar } from "react-native-paper";
import { NAVIGATION } from "../constants/routes";
import {
  saveMediaToStorage,
  showToast,
  updateUser,
} from "../constants/functions";
export default function ProfileScreen({ navigation, route }) {
  const admin = route.params?.admin;
  const [image, setimage] = useState(null);
  const { user } = useSelector((state) => state.entities.userReducer);
  const dispatch = useDispatch();
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const urlParts = result.assets[0].uri;
        setimage(urlParts);
        const url = await saveMediaToStorage(
          urlParts,
          `/profile/${user.firstName}${user.lastName}`
        );
        const userUpdate = {
          ...user,
          profilePic: url,
        };
        await updateUser(userUpdate, dispatch);
        showToast("Profile picture updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(admin ? NAVIGATION.ADMIN_HOME : NAVIGATION.HOME);
      return () => true;
    },
    []
  );
  return (
    <View>
      <View style={styles.headerstyle}>
        <TouchableOpacity onPress={pickImage}>
          {user.profilePic ? (
            <Avatar.Image
              size={SIZES.largeTitle * 1.2}
              source={{ uri: user.profilePic }}
            />
          ) : image ? (
            <Avatar.Image
              size={SIZES.largeTitle * 1.2}
              source={{ uri: image }}
            />
          ) : (
            <Avatar.Icon
              size={SIZES.largeTitle * 1.2}
              icon="account"
              style={{ backgroundColor: COLORS.white }}
            />
          )}
        </TouchableOpacity>
        <AppText color={COLORS.white}>
          {user.firstName} {user.lastName}
        </AppText>
      </View>
      <View style={styles.container}>
        {user.email && (
          <View style={{ ...styles.gpsButton }}>
            <AppText size={1.8}>{user.email}</AppText>
          </View>
        )}
        <View style={{ ...styles.gpsButton }}>
          <AppText size={1.8}>+91 {user.mobile}</AppText>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATION.POINTS_SYSTEM)}
          style={{ ...styles.gpsButton }}
        >
          <AppText size={1.8}>Points System</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // width: "100%",
    height: SIZES.height * 0.4,
    alignItems: "center",
    justifyContent: "space-around",
    padding: SIZES.base,
  },
  gpsButton: {
    ...FSTYLES,
    width: "90%",
    borderRadius: SIZES.base,
    padding: SIZES.base,
    elevation: SIZES.base1,
    backgroundColor: COLORS.white,
  },
  profile: {
    ...STYLES,
    height: SIZES.h1 * 1.5,
    width: SIZES.h1 * 1.5,
    borderRadius: (SIZES.h1 * 1.5) / 2,
    backgroundColor: COLORS.white,
  },
  headerstyle: {
    ...FSTYLES,
    backgroundColor: COLORS.purple,
    padding: "10%",
  },
});
