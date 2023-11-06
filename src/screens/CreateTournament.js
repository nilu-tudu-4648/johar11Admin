import { StyleSheet, View, TouchableOpacity, BackHandler } from "react-native";
import React, { useState } from "react";
import { COLORS, FSTYLES, SIZES, STYLES } from "../constants/theme";
import { useForm } from "react-hook-form";
import AppText from "../components/AppText";
import FormInput from "../components/FormInput";
import AppLoader from "../components/AppLoader";
import { db } from "../../firebaseConfig";
import { AppButton, AppTextInput } from "../components";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { FIRESTORE_COLLECTIONS } from "../constants/data";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  formatDate,
  formatTimestamp,
  saveMediaToStorage,
  showToast,
} from "../constants/functions";
import { NAVIGATION } from "../constants/routes";
import { Avatar } from "react-native-paper";
const CreateTournament = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const [date, setDate] = useState(new Date());
  const [images, setimages] = useState({ captain1Pic: "", captain2Pic: "" });
  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState(false);
  const [startTime, setStartTime] = useState(null);
  const [show, setShow] = useState(false);
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
        showToast("upload successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstTeamName: "",
      secondTeamName: "",
      prizeAmount: "",
      eventName: "",
      eventLocation: "",
      entryFees: "",
    },
  });
  const onSubmit = async (data) => {
    const {
      firstTeamName,
      secondTeamName,
      prizeAmount,
      eventName,
      eventLocation,
      entryFees,
      eventType,
    } = data;

    try {
      setloading(true);
      const tournamentsCollectionRef = collection(
        db,
        FIRESTORE_COLLECTIONS.TOURNAMENTS
      );

      // Add the tournament data without the 'id' field
      const tournamentData = {
        ...images,
        firstTeamName,
        secondTeamName,
        prizeAmount,
        eventName,
        eventLocation,
        entryFees,
        eventType,
        date: formatDate(date),
        time: formatTimestamp(startTime),
      };
      console.log(tournamentData, "tournamentData");
      // Add the document to Firestore, Firestore will generate an ID
      const docRef = await addDoc(tournamentsCollectionRef, tournamentData);

      // Retrieve the auto-generated Firestore document ID
      const autoGeneratedId = docRef.id;

      // Update the document with the auto-generated ID
      await updateDoc(docRef, { id: autoGeneratedId });

      showToast("Tournament Created Successfully");
      setValue("firstTeamName", "");
      setValue("secondTeamName", "");
      setValue("prizeAmount", "");
      setValue("eventName", "");
      setValue("eventLocation", "");
      setValue("entryFees", "");
      setValue("eventType", "");
      navigation.navigate(NAVIGATION.ADMIN_HOME);
    } catch (error) {
      console.error("Error adding tournament:", error);
      showToast("Something went wrong");
    } finally {
      setloading(false);
    }
  };

  const rules = {
    required: "This field is mandatory",
    pattern: {
      value: /^[aA-zZ\s]+$/,
      message: "Only alphabets are allowed for this field.",
    },
  };
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(NAVIGATION.ADMIN_HOME);
      return () => true;
    },
    []
  );
  return (
    <View style={styles.container}>
      <AppLoader loading={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <AppText
          bold={true}
          style={{ alignSelf: "center", marginVertical: SIZES.h3 * 2 }}
          size={2.5}
        >
          {"Create Tournament"}
        </AppText>
        <View>
          <View style={FSTYLES}>
            <View style={{ ...STYLES, width: "45%" }}>
              <TouchableOpacity
                style={{ ...STYLES, marginVertical: SIZES.base }}
                onPress={() => pickImage("captain1Pic")}
              >
                {images.captain1Pic ? (
                  <Avatar.Image
                    size={SIZES.largeTitle * 1.7}
                    source={{ uri: images.captain1Pic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.largeTitle * 1.7}
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
                    size={SIZES.largeTitle * 1.7}
                    source={{ uri: images.captain2Pic }}
                  />
                ) : (
                  <Avatar.Icon
                    size={SIZES.largeTitle * 1.7}
                    icon="account"
                    style={{ backgroundColor: COLORS.gray }}
                  />
                )}
              </TouchableOpacity>
              <AppText>Captain 2</AppText>
            </View>
          </View>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"First Team name"}
            name="firstTeamName"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"Second Team name"}
            name="secondTeamName"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"Event name"}
            name="eventName"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"Event location"}
            name="eventLocation"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={{
              required: "This field is mandatory",
            }}
            placeholder={"Add Prize Amount"}
            name="prizeAmount"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={{
              required: "This field is mandatory",
            }}
            placeholder={"Add Entry Fee"}
            name="entryFees"
          />
        </View>
        <View>
          <FormInput
            control={control}
            rules={{
              required: "This field is mandatory",
            }}
            placeholder={"Add event Type"}
            name="eventType"
          />
        </View>
        <View style={{ marginBottom: SIZES.base }}>
          <TouchableOpacity onPress={() => setShow(true)}>
            <AppTextInput
              editable={false}
              value={`${formatDate(date)} ${formatTimestamp(startTime)}`}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <AppButton title={"Submit"} onPress={handleSubmit(onSubmit)} />
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
    </View>
  );
};

export default CreateTournament;

const styles = StyleSheet.create({
  inputStyle: {
    width: "100%",
  },
  container: {
    flex: 1,
    padding: SIZES.h3,
    backgroundColor: COLORS.white,
  },
  smallText: {
    fontSize: SIZES.h6,
    alignSelf: "stretch",
  },
});
