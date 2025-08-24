import React, { useMemo } from "react";
import "react-native-gesture-handler";
import { store } from "./src/store/configureStore";
import { Provider } from "react-redux";
import { configureFonts, useTheme, PaperProvider } from "react-native-paper";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { AppLoader } from "./src/components";

const App = () => {
  const [loaded] = useFonts({
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
  });

  const fonts = useMemo(() => {
    if (!loaded) return null;
    
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

    return configureFonts({
      config: {
        ...baseVariants,
        ...customVariants,
      },
    });
  }, [loaded]);

  const theme = useTheme();

  const memoizedTheme = useMemo(() => ({
    ...theme,
    fonts: fonts || theme.fonts
  }), [theme, fonts]);

  if (!loaded) {
    return <AppLoader loading={true} />;
  }

  // eas build -p android --profile preview
  // eas update --branch preview --message "Updating the app"

  // npx expo  start --dev-client
  return (
    <NavigationContainer>
      <Provider store={store}>
        <PaperProvider theme={memoizedTheme}>
          <DrawerNavigator />
        </PaperProvider>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
