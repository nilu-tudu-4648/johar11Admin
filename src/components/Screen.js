import React from "react";
import { StyleSheet, ScrollView, StatusBar, } from "react-native";
import { COLORS, STYLES } from "../constants/theme";

const Screen = ({ children, contentContainerStyle }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
            contentContainerStyle={[styles.screen, contentContainerStyle]}>
            <StatusBar style="light" />
            {children}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    screen: {
        ...STYLES,
        backgroundColor: COLORS.lightwhite,
    },
});

export default Screen;
