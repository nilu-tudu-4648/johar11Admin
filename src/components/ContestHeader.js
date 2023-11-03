import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { AppText } from "../components";
import { AntDesign } from "@expo/vector-icons";
import { COLORS, WNFONTS, SIZES } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const ContestHeader = ({ title }) => {
  const { selectedTournament } = useSelector(
    (state) => state.entities.userReducer
  );
  const navigation = useNavigation();
  const { date, time } = selectedTournament;

  // Parse the date and time strings
  const dateParts = date.split("/");
  const timeParts = time.split(" ");
  const timeAMPM = timeParts[1];
  const timeHoursMinutes = timeParts[0].split(":");

  // Create a new Date object with the parsed values
  const eventDate = new Date(
    parseInt(dateParts[2]),  // Year
    parseInt(dateParts[1]) - 1,  // Month (0-indexed)
    parseInt(dateParts[0]),  // Day
    timeAMPM === "PM" ? parseInt(timeHoursMinutes[0]) + 12 : parseInt(timeHoursMinutes[0]), // Hours
    parseInt(timeHoursMinutes[1])  // Minutes
  );

  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventDate));

  function getTimeLeft(eventDate) {
    const currentTime = new Date();
    const timeDifference = eventDate - currentTime;

    return Math.max(0, Math.floor(timeDifference / 1000));
  }

  const formatTime = (time) => {
    const days = Math.floor(time / 86400); // 86400 seconds in a day
    const hours = Math.floor((time % 86400) / 3600); // 3600 seconds in an hour
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const startTimer = useCallback(() => {
    if (timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft(eventDate);
      if (newTimeLeft <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer); // Clear the interval when the component unmounts
  }, [timeLeft, eventDate]);

  useEffect(() => {
    const timerId = startTimer();
    return () => clearInterval(timerId);
  }, [startTimer]);

  const formattedTime = formatTime(timeLeft);

  return (
    <View style={{ backgroundColor: COLORS.purple, padding: SIZES.base }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "70%",
          justifyContent: "space-around",
        }}
      >
        <AntDesign
          name="arrowleft"
          size={24}
          onPress={() => navigation.goBack()}
          color={COLORS.white}
        />
        <View>
          <AppText color={COLORS.white} style={WNFONTS.h5}>
            {title
              ? title
              : `${selectedTournament.firstTeamName} vs ${selectedTournament.secondTeamName}`}
          </AppText>
          <AppText color={COLORS.white} style={WNFONTS.h6}>
            {formattedTime} left
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default ContestHeader;

const styles = StyleSheet.create({});
