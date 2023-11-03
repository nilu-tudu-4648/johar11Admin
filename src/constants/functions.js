import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, ToastAndroid } from "react-native";
import axios from "axios";
import { setLoginUser, settournaments } from "../store/userReducer";
import { FIRESTORE_COLLECTIONS } from "./data";
import { setcreatePlayers, setleaderBoard } from "../store/playersReducer";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import {
  setAllMatches,
  setAllPlayers,
  setAllTeams,
  setAllUsers,
} from "../store/adminReducer";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

export const logoutUser = async (dispatch) => {
  try {
    dispatch(setLoginUser(null));
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

export const isValidPhoneNumber = (str) => {
  const regex = /^[6-9][0-9]{9}$/;
  return regex.test(str);
};
export const truncateString = (inputString, maxLength) => {
  if (inputString.length > maxLength) {
    return inputString.substring(0, maxLength) + "...";
  }
  return inputString;
};
export const formatDate = (timestamp) => {
  const truncatedTimestamp = Math.floor(timestamp / 1000); // Remove milliseconds

  const date = new Date(truncatedTimestamp * 1000); // Convert to milliseconds

  // Extract the day, month, and year components
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Add 1 to month since it is zero-based
  const year = date.getFullYear().toString(); // Get the last two digits of the year

  // Return the formatted date with AM/PM indicator in ddmmyy format
  return `${day}/${month}/${year}`;
};
export const formatTimestamp = (timestamp) => {
  const truncatedTimestamp = Math.floor(timestamp / 1000); // Remove milliseconds

  const date = new Date(truncatedTimestamp * 1000); // Convert to milliseconds

  // Extract the hours, minutes, and AM/PM indicator
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Return the formatted date with AM/PM indicator in ddmmyy format
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};
export const sanitizeJsonString = (jsonString) => {
  // Remove any characters that are not part of a valid JSON format
  const sanitizedString = jsonString.replace(/[^\x20-\x7E]/g, "");

  return sanitizedString;
};
export function showToast(msg) {
  ToastAndroid.show(msg, ToastAndroid.SHORT);
}
//apis
export const saveMediaToStorage = async (file, path) => {
  try {
    const storage = getStorage();
    const response = await fetch(file);
    const blob = await response.blob();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    const url = await new Promise((res, rej) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          showToast("upload Failed");
          rej(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            res(downloadURL);
          });
        }
      );
    });
    return url; // Return the download URL
  } catch (error) {
    console.log(error);
    throw error; // Rethrow the error for handling in your app
  }
};
export async function getUserDetails(mobile) {
  const q = query(
    collection(db, FIRESTORE_COLLECTIONS.USERS),
    where("mobile", "==", mobile)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // User with the provided mobile number exists
    return querySnapshot.docs[0].data();
  }
  // User does not exist
  return null;
}
export const updateUser = async (fdata, dispatch) => {
  try {
    const postRef = doc(db, FIRESTORE_COLLECTIONS.USERS, fdata.id);
    await updateDoc(postRef, fdata).then(async () => {
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(fdata));
      dispatch(setLoginUser(fdata));
    });
  } catch (error) {
    console.log(error);
  }
};
export function filterUpcomingEvents(events) {
  const currentDate = new Date();

  // Filter events that have 'date' and 'time' properties in the future
  const upcomingEvents = events.filter((event) => {
    if (event.date && event.time) {
      // Parse the date string "30/10/2023"
      const dateParts = event.date.split("/");
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based
      const day = parseInt(dateParts[0], 10);

      // Parse the time string "4:32 PM"
      const timeParts = event.time.match(/\d+/g);
      const hours = parseInt(timeParts[0], 10) % 12; // Handle 12-hour format
      const minutes = parseInt(timeParts[1], 10);
      const isPM = event.time.includes("PM");

      const eventTime = new Date(); // Create a new Date object for the time
      eventTime.setHours(hours);
      eventTime.setMinutes(minutes);

      if (isPM) {
        eventTime.setHours(eventTime.getHours() + 12); // Add 12 hours for PM
      }

      const eventDateTime = new Date(
        year,
        month,
        day,
        eventTime.getHours(),
        eventTime.getMinutes()
      );

      return eventDateTime > currentDate;
    }
    return false;
  });
  return upcomingEvents;
}
export function filterPastEvents(events) {
  const currentDate = new Date();

  // Filter events that have 'date' and 'time' properties in the past
  const pastEvents = events.filter((event) => {
    if (event.date && event.time) {
      // Parse the date string "30/10/2023"
      const dateParts = event.date.split("/");
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are 0-based
      const day = parseInt(dateParts[0], 10);

      // Parse the time string "4:32 PM"
      const timeParts = event.time.match(/\d+/g);
      const hours = parseInt(timeParts[0], 10) % 12; // Handle 12-hour format
      const minutes = parseInt(timeParts[1], 10);
      const isPM = event.time.includes("PM");

      const eventTime = new Date(); // Create a new Date object for the time
      eventTime.setHours(hours);
      eventTime.setMinutes(minutes);

      if (isPM) {
        eventTime.setHours(eventTime.getHours() + 12); // Add 12 hours for PM
      }

      const eventDateTime = new Date(
        year,
        month,
        day,
        eventTime.getHours(),
        eventTime.getMinutes()
      );

      return eventDateTime < currentDate;
    }
    return false;
  });
  return pastEvents;
}
export const getTournaments = async (dispatch, setloading) => {
  try {
    // Create a query for the tournaments collection
    const q = query(collection(db, FIRESTORE_COLLECTIONS.TOURNAMENTS));

    // Fetch the initial data
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });

    // Set the initial data
    const upcomingEvents = e(arr);
    dispatch(settournaments(upcomingEvents));

    // Set up a listener for live updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          // Handle added data
          const data = change.doc.data();
          console.log("Added data: ", data);
        } else if (change.type === "modified") {
          // Handle modified data
          const data = change.doc.data();
          console.log("Modified data: ", data);
        } else if (change.type === "removed") {
          // Handle removed data
          console.log("Removed data ID: ", change.doc.id);
        }
      });
    });

    // When you want to stop listening for updates
    // Call the `unsubscribe` function
    // For example, to stop listening when the component unmounts
    // unsubscribe();

    if (setloading) {
      setloading(false);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getLeaderBoard = async (dispatch, id, setloading) => {
  try {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.CREATED_TEAMS),
      where("matchId", "==", id)
    );
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });
    dispatch(setleaderBoard(arr));
    if (setloading) {
      setloading(false);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getPlayersfromTeamName = async (
  firstTeamName,
  secondTeamName,
  dispatch
) => {
  try {
    const arr = [];
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.PLAYERS),
      where("teamName", "==", firstTeamName)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      arr.push({ id, ...data });
    });

    const qr = query(
      collection(db, FIRESTORE_COLLECTIONS.PLAYERS),
      where("teamName", "==", secondTeamName)
    );
    const querySnapshot2 = await getDocs(qr);
    querySnapshot2.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      arr.push({ id, ...data });
    });
    dispatch(setcreatePlayers(arr));
  } catch (error) {
    console.log(error);
  }
};

//admin apis
export const getAllUsers = async (dispatch, func) => {
  try {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.USERS),
      where("admin", "==", "false")
    );
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });
    dispatch(setAllUsers(arr));
    func(false);
  } catch (error) {
    console.log(error);
  }
};
export const getAllTeams = async (dispatch, func) => {
  try {
    const q = query(collection(db, FIRESTORE_COLLECTIONS.TEAM_NAMES));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });
    dispatch(setAllTeams(arr));
    func(false);
  } catch (error) {
    console.log(error);
  }
};
export const deleteTeam = async (id, func) => {
  try {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.TEAM_NAMES, id));
    func();
  } catch (error) {
    console.log(error);
  }
};
export const deleteUser = async (id, func) => {
  try {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.PLAYERS, id));
    if (func) func();
  } catch (error) {
    console.log(error);
  }
};
export const deleteMatch = async (id, func) => {
  try {
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.TOURNAMENTS, id));
    func();
  } catch (error) {
    console.log(error);
  }
};
export const getAllPlayers = async (dispatch, func) => {
  console.log("called");
  try {
    const q = query(collection(db, FIRESTORE_COLLECTIONS.PLAYERS));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });
    dispatch(setAllPlayers(arr));
    func(false);
  } catch (error) {
    console.log(error);
  }
};
export const getAllMatches = async (dispatch, func) => {
  try {
    const q = query(collection(db, FIRESTORE_COLLECTIONS.TOURNAMENTS));
    const querySnapshot = await getDocs(q);
    let arr = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const id = doc.id;
      return arr.push({ id, ...data });
    });
    dispatch(setAllMatches(arr));
    func(false);
  } catch (error) {
    console.log(error);
  }
};
