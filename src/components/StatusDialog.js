import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, SIZES, STYLES } from "../constants/theme";
import { Dialog } from "react-native-paper";
import AppText from "./AppText";

const StatusDialog = ({ visible, setvisible, options, setSelectedOption }) => {
  const handleSelectOption = (option) => {
    setSelectedOption(option.statusDesc);
    setvisible(false);
  };
  return (
    <Dialog
      visible={visible}
      onDismiss={() => setvisible(false)}
      style={styles.modalContainer}
    >
      <View style={{ top: -10 }}>
        <AppText bold={true} style={{ bottom: 10 }}>
          Status
        </AppText>
        {
          <View style={styles.optionsContainer}>
            {options?.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleSelectOption(item)}
              >
                <AppText size={1.3} style={{ marginVertical: 12 }}>
                  {item.statusDesc}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        }
      </View>
    </Dialog>
  );
};

export default StatusDialog;

const styles = StyleSheet.create({
  inputStyle: {
    width: "100%",
    marginVertical: 6,
  },
  error: {
    color: "red",
    fontSize: SIZES.h7,
    alignSelf: "stretch",
    top: 2,
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    alignSelf: "center",
    top: 0,
    padding: 15,
    borderRadius: 8,
  },
  sportsButton: {
    borderRadius: 5,
    padding: SIZES.base1,
    borderColor: COLORS.purple2,
    borderWidth: 0.5,
    marginTop: 6,
    width: "100%",
    height: 45,
    ...STYLES,
  },
});
