import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, SIZES, STYLES } from "../constants/theme";
import { Dialog } from "react-native-paper";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";
import { getCreatedteamsbymatchId, saveToFirebase, showToast } from "../constants/functions";
const PrizeAmountDialog = ({ visible, setvisible, item,matchId,names,setNames }) => {
  const [itemSelected, setitemSelected] = useState(item);
  const onChangeText = (text, t) => {
    setitemSelected({ ...itemSelected, [text]: t });
  };
  
  const filterKeys = Object.keys(itemSelected)
  const handleSubmit = async () => {
    try {
      const addItem = names.map(ite=>ite.name===itemSelected.name? {...ite,prizeAmount:itemSelected.prizeAmount}:ite)
     await saveToFirebase(addItem,matchId)
     await getCreatedteamsbymatchId(setNames,matchId,true);
     showToast("Prize updated")
     setvisible(false)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setitemSelected(item);
  }, [item]);
  return (
    <Dialog
      visible={visible}
      onDismiss={() => setvisible(false)}
      style={styles.modalContainer}
    >
      <View style={{ top: -10 }}>
        <AppText bold={true} style={{ bottom: 10 }}>
          {"Update Player Prize"}
        </AppText>
        {filterKeys.map((ite, i) => (
          <View key={i}>
            <AppText size={1.5}>{ite}</AppText>
            <AppTextInput
              placeholder={ite}
              value={itemSelected[ite]}
              onChangeText={(t) => onChangeText(ite, t)}
            />
          </View>
        ))}
      </View>
      <AppButton title={"Update"} onPress={handleSubmit} />
    </Dialog>
  );
};

export default PrizeAmountDialog;

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
