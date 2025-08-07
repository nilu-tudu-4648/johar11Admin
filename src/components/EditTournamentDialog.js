import { StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FSTYLES, SIZES, STYLES } from "../constants/theme";
import { Dialog } from "react-native-paper";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";

import { formatDate, formatTimestamp, saveMediaToStorage, showToast, updateTournament } from "../constants/functions";
import { ScrollView } from "react-native-gesture-handler";
import { Avatar } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const EditTournamentDialog = ({ visible, setvisible, item, callGetAllMatches }) => {
  const [itemSelected, setitemSelected] = useState(item || {});
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [images, setimages] = useState({ captain1Pic: "", captain2Pic: "" });
  const [show, setShow] = useState(false);
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);

  const onChangeText = (text, t) => {
    setitemSelected({ ...(itemSelected || {}), [text]: t });
  };

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    showStartTimePicker();
    setDate(currentDate);
  };

  const handleStartTimeChange = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setIsStartTimePickerVisible(false);
    setStartTime(currentDate);
  };

  const combineDateAndTime = (date, time) => {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toISOString().split('T')[1];
    return `${formattedDate}T${formattedTime}`;
  };

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.1,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const urlParts = result.assets[0].uri;
        const url = await saveMediaToStorage(
          urlParts,
          `/playersCaptain/${Math.random()}`
        );
        setimages({ ...images, [type]: url });
        setitemSelected({ ...(itemSelected || {}), [type]: url });
        showToast("upload successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {
        ...(itemSelected || {}),
        ...images,
        date: formatDate(date),
        time: formatTimestamp(startTime),
        dateAndTime: combineDateAndTime(date, startTime),
      };

      await updateTournament(updatedData, () => {
        showToast("Tournament details updated");
        callGetAllMatches();
        setvisible(false);
      });
    } catch (error) {
      console.log(error);
      showToast("Error updating tournament");
    }
  };

  useEffect(() => {
    if (item) {
      setitemSelected(item || {});
      setimages({
        captain1Pic: item?.captain1Pic || "",
        captain2Pic: item?.captain2Pic || ""
      });
      
      // Parse existing date and time
      if (item?.date) {
        const dateParts = item.date.split("/");
        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          setDate(new Date(year, month - 1, day));
        }
      }
      
      if (item?.time) {
        // Parse time string "HH:MM" format
        const [hours, minutes] = item.time.split(":");
        const timeDate = new Date();
        timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        setStartTime(timeDate);
      }
    } else {
      // Reset state when item is null
      setitemSelected({});
      setimages({ captain1Pic: "", captain2Pic: "" });
      setDate(new Date());
      setStartTime(new Date());
    }
  }, [item]);

  if (!item) return null;

  const editableFields = [
    { key: 'firstTeamName', label: 'First Team Name' },
    { key: 'secondTeamName', label: 'Second Team Name' },
    { key: 'eventName', label: 'Event Name' },
    { key: 'eventLocation', label: 'Event Location' },
    { key: 'prizeAmount', label: 'Prize Amount' },
    { key: 'entryFees', label: 'Entry Fees' },
    { key: 'eventType', label: 'Event Type' },
    { key: 'isTesting', label: 'Is Testing' },
  ];

  return (
    <Dialog
      visible={visible}
      onDismiss={() => setvisible(false)}
      style={styles.modalContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ top: -10 }}>
          <AppText bold={true} style={{ bottom: 10, textAlign: 'center', fontSize: 18 }}>
            {"Update Tournament Details"}
          </AppText>

          {/* Captain Images */}
          <View style={FSTYLES}>
            <View style={{ ...STYLES, width: "45%" }}>
              <TouchableOpacity
                style={{ ...STYLES, marginVertical: SIZES.base }}
                onPress={() => pickImage("captain1Pic")}
              >
                {images.captain1Pic ? (
                  <Avatar.Image
                    size={SIZES.largeTitle * 1.2}
                    source={{ uri: images.captain1Pic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.largeTitle * 1.2}
                    icon="account"
                    style={{ backgroundColor: COLORS.gray }}
                  />
                )}
              </TouchableOpacity>
              <AppText>Captain 1</AppText>
            </View>
            <View style={{ ...STYLES, width: "45%" }}>
              <TouchableOpacity
                style={{ ...STYLES, marginVertical: SIZES.base }}
                onPress={() => pickImage("captain2Pic")}
              >
                {images.captain2Pic ? (
                  <Avatar.Image
                    size={SIZES.largeTitle * 1.2}
                    source={{ uri: images.captain2Pic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.largeTitle * 1.2}
                    icon="account"
                    style={{ backgroundColor: COLORS.gray }}
                  />
                )}
              </TouchableOpacity>
              <AppText>Captain 2</AppText>
            </View>
          </View>

          {/* Editable Fields */}
          {editableFields.map((field, i) => (
            <View key={i} style={{ marginVertical: 8 }}>
              <AppText size={1.5} style={{ marginBottom: 4 }}>{field.label}</AppText>
              <AppTextInput
                placeholder={field.label}
                value={itemSelected?.[field.key] || ""}
                onChangeText={(t) => onChangeText(field.key, t)}
              />
            </View>
          ))}

          {/* Date and Time Picker */}
          <View style={{ marginVertical: 8 }}>
            <AppText size={1.5} style={{ marginBottom: 4 }}>Date & Time</AppText>
            <TouchableOpacity onPress={() => setShow(true)}>
              <AppTextInput
                editable={false}
                value={`${formatDate(date)} ${formatTimestamp(startTime)}`}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
          <AppButton
            title={"Cancel"}
            onPress={() => setvisible(false)}
            style={{ width: "45%" }}
            varient="outlined"
          />
          <AppButton
            title={"Update"}
            onPress={handleSubmit}
            style={{ width: "45%" }}
          />
        </View>
      </ScrollView>

      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode={"date"}
          display="default"
          minimumDate={new Date()}
          onChange={onChange}
        />
      )}
      {isStartTimePickerVisible && (
        <DateTimePicker
          value={startTime || new Date()}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}
    </Dialog>
  );
};

export default EditTournamentDialog;

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    top: 0,
    padding: 15,
    borderRadius: 8,
    maxHeight: "80%",
  },
});
