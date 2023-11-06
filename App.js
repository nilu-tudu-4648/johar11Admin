import React from "react";
import "react-native-gesture-handler";
import { store } from "./src/store/configureStore";
import { Provider } from "react-redux";
import { configureFonts, useTheme, PaperProvider } from "react-native-paper";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
const App = () => {
  const [loaded] = useFonts({
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  });
  const baseFont = {
    fontFamily: "Inter-Medium",
  };

  const baseVariants = configureFonts({ config: baseFont });
  const customVariants = {
    displayMedium: {
      ...baseVariants.displayMedium,
      fontFamily: "Inter-Bold",
    },
  };

  const fonts = configureFonts({
    config: {
      ...baseVariants,
      ...customVariants,
    },
  });

  const theme = useTheme();

  if (!loaded) {
    return null;
  }

  // eas build -p android --profile preview
  // eas update --branch preview --message "Updating the app"

  // npx expo  start --dev-client
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PaperProvider theme={{ ...theme, fonts }}>
          <DrawerNavigator />
        </PaperProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
