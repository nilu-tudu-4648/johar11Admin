import { StyleSheet, View } from "react-native";
import React from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Avatar } from "react-native-paper";
import { COLORS, FSTYLES, SIZES } from "./src/constants/theme";
import AppText from "./src/components/AppText";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "./src/constants/functions";
import { AppButton } from "./src/components";
import { Image } from "react-native";
const DrawerItems = ({ navigation }) => {
  const { user } = useSelector((state) => state.entities.userReducer);
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: COLORS.purple }}
    >
      <View style={styles.headerstyle}>
        {user?.profilePic ? (
          <Avatar.Image
            size={SIZES.largeTitle * 1.2}
            source={{ uri: user.profilePic }}
          />
        ) : (
          <Avatar.Icon
            size={SIZES.largeTitle * 1.2}
            icon="account"
            style={{ backgroundColor: COLORS.white }}
          />
        )}
        <AppText bold={true} color={COLORS.white}>
          {`${user?.firstName} ${user?.lastName}`}
        </AppText>
      </View>
      <View style={styles.container}>
        <Image
          source={require("./assets/qr.jpg")}
          style={{ width: "100%", height: 500, resizeMode: "contain",marginVertical:20 }}
        />
        <View style={{ width: "100%" }}>
          {/* {
            dashboardCards.map((item, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate(item.navigation)} style={styles.drawerCards}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={item.image} resizeMode='contain' style={{ width: SIZES.h3, height: SIZES.h3 }} />
                  <AppText bold={true} size={1.5} style={{ left: 12 }}>{item.name}</AppText>
                </View>
                <Entypo name="chevron-right" size={SIZES.h4} color={COLORS.black} />
              </TouchableOpacity>
            ))
          } */}
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            paddingBottom: SIZES.h4,
          }}
        >
          <AppText size={1} color={COLORS.lightgray1}>
            1.0.6
          </AppText>
          <AppButton
            title={"Logout"}
            style={{
              width: "60%",
              marginTop: SIZES.base1,
              height: SIZES.h1 * 1.1,
              borderRadius: SIZES.base,
            }}
            onPress={() => {
              navigation.closeDrawer();
              logoutUser(dispatch);
            }}
          />
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export default DrawerItems;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    borderTopRightRadius: SIZES.h3,
    borderTopLeftRadius: SIZES.h3,
    backgroundColor: COLORS.white,
    height: "80%",
  },
  drawerCards: {
    ...FSTYLES,
    paddingHorizontal: "10%",
    paddingVertical: "1%",
    marginVertical: "4%",
    backgroundColor: COLORS.white,
    elevation: SIZES.base1,
    borderRadius: SIZES.h4,
    width: "85%",
    alignSelf: "center",
    height: SIZES.h1 * 1.5,
  },
  headerstyle: {
    ...FSTYLES,
    backgroundColor: COLORS.purple,
    height: "20%",
    paddingHorizontal: "10%",
  },
});
