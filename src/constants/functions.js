import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, ToastAndroid } from "react-native";
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
  setDoc,
  getDoc,
  getFirestore,
  serverTimestamp,
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
export const formatTime24Hour = (date) => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
export const formatDate = (date) => {
  if (!date) return '';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export function convertToISOString(inputDate) {
  // Split the input date string into date and time parts
  const [datePart, timePart] = inputDate.split(' ');

  // Split the date part into day, month, and year
  const [day, month, year] = datePart.split('/');

  // Extract hours, minutes, and AM/PM from the time part
  const [time, period] = timePart.split(' ');
  const [hours, minutes] = time.split(':');

  // Adjust hours for 12-hour format
  const adjustedHours = period === 'PM' ? parseInt(hours, 10) + 12 : parseInt(hours, 10);

  // Create a new Date object with the specified components
  const convertedDate = new Date(`${year}-${month}-${day}T${adjustedHours}:${minutes}:00.000Z`);

  // Convert the date to ISO string
  const isoString = convertedDate.toISOString();

  return isoString;
}



export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  const timeString = timestamp.toLocaleTimeString(undefined, options);

  return timeString;
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
export const getCreatedteamsbymatchId = async (func, matchId,update) => {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.PRIZE_DISTRIBUTE, matchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      func(docSnap.data().names);
    } else {
      // const names = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'].map((ite) => ({
      //   id:ite,
      //   name: ite,
      //   prizeAmount: "0",
      // }));
      const names = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        name: `${i + 1}`,
        prizeAmount: "0",
      }));
    if(!update)  await saveToFirebase(names, matchId);
      await getPrizeDistribution(matchId,func);
    }
  } catch (error) {
    console.log(error);
  }
};
export const getPrizeDistribution = async (matchId,func) => {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.PRIZE_DISTRIBUTE, matchId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      func(docSnap.data().names);
      return true;
    } else {
      console.log("No such document!");
      return false;
    }
  } catch (error) {
    console.log("Error:", error);
  }
};
export const saveToFirebase = async (names, matchId) => {
  try {
    await setDoc(doc(db, FIRESTORE_COLLECTIONS.PRIZE_DISTRIBUTE, matchId), {
      names: names,
    });
  } catch (error) {
    console.log("Error:", error);
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
    await deleteDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, id));
    if (func) func();
  } catch (error) {
    console.log(error);
  }
};
export const deletePlayers = async (id, func) => {
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
export const markItcomplete = async (fdata, func) => {
  try {
    const postRef = doc(db, FIRESTORE_COLLECTIONS.TOURNAMENTS, fdata.id);
    await updateDoc(postRef, fdata).then(async () => {
      func();
    });
  } catch (error) {
    console.log(error);
  }
};
// export const updateTournament = async (fdata, func) => {
//   try {
//     const postRef = doc(db, FIRESTORE_COLLECTIONS.TOURNAMENTS, fdata.id);
//     await updateDoc(postRef, fdata).then(async () => {
//       if (func) func();
//     });
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };
export const updateTournament = async (tournamentData, callback) => {
  try {
    if (!tournamentData.id) {
      console.error('Error updating tournament: Missing document ID');
      showToast('Tournament data is incomplete');
      return;
    }

    const tournamentRef = doc(db, FIRESTORE_COLLECTIONS.TOURNAMENTS, tournamentData.id);

    // Check if the document exists
    const docSnapshot = await getDoc(tournamentRef);
    if (!docSnapshot.exists) {
      console.error('Error updating tournament: Document not found');
      showToast('Tournament not found');
      return;
    }

    // Update the document
    await updateDoc(tournamentRef, {
      ...tournamentData,
      updatedAt: serverTimestamp()
    });
    
    if (callback) {
      callback();
    }
    
    showToast('Tournament updated successfully');
  } catch (error) {
    console.error('Error updating tournament:', error);
    showToast('Failed to update tournament');
  }
};
export const getAllPlayers = async (dispatch, func) => {
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
