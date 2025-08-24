import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NAVIGATION } from "../constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { setLoginUser } from "../store/userReducer";

import {
  AddPlayerScreen,
  AddTeamsScreen,
  AdminHomeScreen,
  AlertScreen,
  AllTeamsScreen,
  AllUsersScreen,
  CreateTournament,
  LoginScreen,
  PointsSystemScreen,
  PriceDistributionScreen,
  ProfileScreen,
  SignUpScreen,
  WelcomeScreen,
} from "../screens";
import { StyleHeader } from "../components";
import AllPlayersScreen from "../screens/AllPlayersScreen";
import AllTournaments from "../screens/AllTournaments";
const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { userLoggedIn, user } = useSelector(
    (state) => state.entities.userReducer
  );
  const dispatch = useDispatch();
  
  const checkUserDetails = React.useCallback(async () => {
    try {
      const loggedInUserString = await AsyncStorage.getItem("loggedInUser");
      if (loggedInUserString) {
        const loggedInUser = JSON.parse(loggedInUserString);
        dispatch(setLoginUser(loggedInUser));
      } else {
        dispatch(setLoginUser(null));
      }
    } catch (error) {
      console.log({ error });
    }
  }, [dispatch]);
  
  React.useEffect(() => {
    checkUserDetails();
  }, [checkUserDetails, userLoggedIn]);
  
  const options = React.useMemo(() => ({ headerShown: false }), []);
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: !user ? false : true,
        header: ({ navigation }) => <StyleHeader />,
      })}
    >
      {!user ? (
        <>
          <Stack.Screen name={NAVIGATION.WELCOME} component={WelcomeScreen} />
          <Stack.Screen name={NAVIGATION.LOGIN} component={LoginScreen} />
          <Stack.Screen name={NAVIGATION.REGISTER} component={SignUpScreen} />
        </>
      ) : (
        <>
          {user.admin === "true" ? (
            <>
              <Stack.Screen
                options={options}
                name={NAVIGATION.ADMIN_HOME}
                component={AdminHomeScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ADD_PLAYER}
                component={AddPlayerScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ADD_TEAM}
                component={AddTeamsScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.CREATE_TOURNAMENT}
                component={CreateTournament}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ALL_USERS}
                component={AllUsersScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ALL_PLAYERS}
                component={AllPlayersScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ALL_TEAMS}
                component={AllTeamsScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.ALL_TOURNAMENTS}
                component={AllTournaments}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.PROFILE}
                component={ProfileScreen}
              />
              <Stack.Screen
                options={options}
                name={NAVIGATION.PRIZE_DISTRIBUTION}
                component={PriceDistributionScreen}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                options={options}
                name={"Alert"}
                component={AlertScreen}
              />
            </>
          )}
          <Stack.Screen
            options={options}
            name={NAVIGATION.POINTS_SYSTEM}
            component={PointsSystemScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
