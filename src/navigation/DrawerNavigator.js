import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerItems from "../../DrawerItems";
import { NAVIGATION } from "../constants/routes";
import { SIZES } from "../constants/theme";
import AppNavigator from "./AppNavigator";
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: SIZES.width * .8,
        },
        headerShown: false,
      }}
      drawerContent={(props) => <DrawerItems {...props} />}
    >
      <Drawer.Screen name={NAVIGATION.APP_NAVIGATOR} component={AppNavigator} />
    </Drawer.Navigator>
  );
}
