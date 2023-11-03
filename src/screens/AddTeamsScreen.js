import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { COLORS, SIZES } from "../constants/theme";
import { useForm } from "react-hook-form";
import AppText from "../components/AppText";
import FormInput from "../components/FormInput";
import AppLoader from "../components/AppLoader";
import { db } from "../../firebaseConfig";
import { AppButton } from "../components";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { FIRESTORE_COLLECTIONS } from "../constants/data";
import { showToast } from "../constants/functions";
const AddTeamsScreen = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      teamName: "",
    },
  });
  async function getUser(name) {
    try {
      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.TEAM_NAMES),
        where("teamName", "==", name)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        showToast("Team name already exists");
        return true;
      } else {
        return false;
      }
    } catch (error) {
      showToast("Error checking team existence");
      return true; // You may choose to handle this differently, such as returning false on error.
    }
  }

  const onSubmit = async (data) => {
    const { teamName } = data;

    try {
      setloading(true);
      const teamNameExists = await getUser(teamName);
      if (teamNameExists) {
        return;
      }
      const teamNamesCollectionRef = collection(
        db,
        FIRESTORE_COLLECTIONS.TEAM_NAMES
      );
      await addDoc(teamNamesCollectionRef, {
        teamName,
      });

      showToast("Team name added successfully");
      setValue("teamName", "");
    } catch (error) {
      console.error("Error adding teamName:", error);
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

  return (
    <View style={styles.container}>
      <AppLoader loading={loading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginVertical: SIZES.h1 * 2 }}
      >
        <AppText
          bold={true}
          style={{ alignSelf: "center", marginVertical: SIZES.h3 * 2 }}
          size={2.5}
        >
          {"Add Teams"}
        </AppText>
        <View>
          <FormInput
            control={control}
            rules={rules}
            placeholder={"Team name"}
            name="teamName"
          />
        </View>
      </ScrollView>
      <AppButton title={"Submit"} onPress={handleSubmit(onSubmit)} />
    </View>
  );
};

export default AddTeamsScreen;

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
