import { StyleSheet, View, Image } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { useForm } from "react-hook-form";
import AppText from "../components/AppText";
import FormInput from "../components/FormInput";
import AppLoader from "../components/AppLoader";
import { db } from "../../firebaseConfig";
import { AppButton } from "../components";
import {
  addDoc,
  collection,
  getDocs,
  query,
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { NAVIGATION } from "../constants/routes";
import { FIRESTORE_COLLECTIONS } from "../constants/data";
import { BackHandler } from "react-native";
import { showToast } from "../constants/functions";
const SignUpScreen = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      password: "",
    },
  });
  async function getUser(mobile) {
    const q = query(
      collection(db, FIRESTORE_COLLECTIONS.USERS),
      where("mobile", "==", mobile)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.length > 0;
  }

  const onSubmit = async (data) => {
    const { firstName, lastName, email, password, mobile } = data;

    try {
      setloading(true);
      const userExists = await getUser(mobile);

      if (userExists) {
        showToast("User already Exist");
      } else {
        await runTransaction(db, async (transaction) => {
          const usersCollectionRef = collection(
            db,
            FIRESTORE_COLLECTIONS.USERS
          );
          const userQuery = query(
            usersCollectionRef,
            where("mobile", "==", mobile)
          );
          const querySnapshot = await getDocs(userQuery);

          if (querySnapshot.empty) {
            // Include the document ID in the data
            const userData = {
              id: "", // Firestore will generate a unique ID
              email,
              password,
              firstName,
              lastName,
              mobile,
              profilePic: "",
              admin: "false",
            };

            const docRef = await addDoc(usersCollectionRef, userData);

            // Update the document with the auto-generated ID
            await updateDoc(docRef, { id: docRef.id });

            showToast("Sign Up successfully");
          } else {
            showToast("User already Exist");
          }
        });

        navigation.navigate(NAVIGATION.LOGIN);
      }
    } catch (error) {
      console.error("An error occurred during sign-up:", error);
      showToast("Sign Up failed. Please try again.");
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
  const phonePattern = /^[6-9][0-9]{9}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  BackHandler.addEventListener(
    "hardwareBackPress",
    () => {
      navigation.navigate(NAVIGATION.WELCOME);
      return () => true;
    },
    []
  );
  return (
    <View style={styles.container}>
      <AppLoader loading={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={require("../../assets/JOHAR.png")} style={styles.logo} />
        <AppText
          bold={true}
          style={{ alignSelf: "center", marginVertical: SIZES.h3 * 2 }}
          size={2.5}
        >
          {"Registration"}
        </AppText>
        <View style={styles.inputContainer}>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"First name"}
            name="firstName"
          />
          <FormInput
            control={control}
            rules={rules}
            placeholder={"Last Name"}
            name="lastName"
          />
          <FormInput
            control={control}
            rules={{
              pattern: {
                value: emailPattern,
                message: "Please enter valid email",
              },
            }}
            placeholder={"Email"}
            name="email"
          />
          <FormInput
            control={control}
            rules={{
              required: "This field is mandatory",
              pattern: {
                value: phonePattern,
                message: "Please enter valid Phone number",
              },
              minLength: {
                value: 10,
                message: "Please enter valid Phone number",
              },
            }}
            keyboardType={"numeric"}
            placeholder={"Enter Mobile Number"}
            name="mobile"
            maxLength={10}
          />
          <FormInput
            control={control}
            rules={{
              required: "This field is mandatory",
            }}
            placeholder={"Password"}
            name="password"
          />
        </View>
      </ScrollView>
      <View>
        <AppButton title="Register" onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SIZES.padding,
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 100 / 2,
  },
  inputContainer: {
    marginVertical: SIZES.padding * 2,
  },
});
