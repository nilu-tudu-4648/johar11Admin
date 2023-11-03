import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NAVIGATION } from "../constants/routes";
import { DEFScreen, GKScreen, MIDScreen, STScreen } from "../screens";
const Tab = createMaterialTopTabNavigator();

export default function CreateTeamNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name={NAVIGATION.GK_SCREEN} component={GKScreen} />
      <Tab.Screen name={NAVIGATION.DEF_SCREEN} component={DEFScreen} />
      <Tab.Screen name={NAVIGATION.MID_SCREEN} component={MIDScreen} />
      <Tab.Screen name={NAVIGATION.ST_SCREEN} component={STScreen} />
    </Tab.Navigator>
  );
}
