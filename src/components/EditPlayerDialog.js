import { StyleSheet, View, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, SIZES, STYLES } from "../constants/theme";
import { Dialog, Avatar } from "react-native-paper";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import AppButton from "./AppButton";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { FIRESTORE_COLLECTIONS } from "../constants/data";
import { showToast, saveMediaToStorage } from "../constants/functions";
import * as ImagePicker from "expo-image-picker";
import OptimizedImage from "./OptimizedImage";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const EditPlayerDialog = ({ visible, setvisible, item, callGetAllplayer }) => {
  const [itemSelected, setitemSelected] = useState(item);
  const [newPlayerPic, setNewPlayerPic] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const onChangeText = (text, t) => {
    setitemSelected({ ...itemSelected, [text]: t });
  };

  const uploadImageToFirebase = async (uri, path) => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, path);
      
      // Create a blob from the URI
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Progress tracking can be added here
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            }).catch(reject);
          }
        );
      });
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      "Select Photo",
      "Choose an option to add player photo",
      [
        { text: "Camera", onPress: () => pickImage(true) },
        { text: "Photo Library", onPress: () => pickImage(false) },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const pickImage = async (useCamera = false) => {
    try {
      setUploadingImage(true);
      
      // Request permissions
      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          showToast('Camera permission is required!');
          return;
        }
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          showToast('Photo library permission is required!');
          return;
        }
      }

      let result;
      if (useCamera) {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1,
          base64: false, // Don't need base64 for Firebase upload
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.1,
          base64: false, // Don't need base64 for Firebase upload
          legacy: true, // Use legacy picker to avoid content:// URIs on Android
        });
      }
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log('Selected image URI:', imageUri);
        setNewPlayerPic(imageUri); // Set local preview immediately
        
        try {
          // Upload to Firebase
          const storagePath = `/players/${item.name || 'player'}_${Date.now()}.jpg`;
          let url;
          
          // Try our custom upload function first
          try {
            url = await uploadImageToFirebase(imageUri, storagePath);
          } catch (uploadError) {
            console.log('Custom upload failed, trying original function:', uploadError);
            // Fallback to original function
            url = await saveMediaToStorage(imageUri, storagePath);
          }
          
          setitemSelected({ ...itemSelected, playerPic: url });
          setNewPlayerPic(url); // Update with Firebase URL
          showToast("Photo uploaded successfully");
        } catch (firebaseError) {
          console.error('Firebase upload failed:', firebaseError);
          showToast("Error uploading photo to server");
        }
      }
    } catch (error) {
      console.log(error);
      showToast("Error uploading photo");
    } finally {
      setUploadingImage(false);
    }
  };
  const filterKeys = Object.keys(itemSelected).filter(
    (ite) =>
      ite !== "id" &&
      ite !== "selectedViceCaptain" &&
      ite !== "selectedCaptain" &&
      ite !== "isActive" &&
      ite !== "playerPic"
  );
  const handleSubmit = async () => {
    try {
      const postRef = doc(db, FIRESTORE_COLLECTIONS.PLAYERS, item.id);
      await updateDoc(postRef, itemSelected).then(() => {
        showToast("Player details updated");
        callGetAllplayer();
      });
      setvisible(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setitemSelected(item);
    setNewPlayerPic(item?.playerPic || null);
  }, [item]);
  return (
    <Dialog
      visible={visible}
      onDismiss={() => setvisible(false)}
      style={styles.modalContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ top: -10 }}>
          <AppText bold={true} style={{ bottom: 10 }}>
            {"Update Player Details"}
          </AppText>
          
          {/* Player Photo Section */}
          <View style={styles.photoSection}>
            <AppText size={1.5} style={{ marginVertical: 10 }}>PLAYER PHOTO</AppText>
            <View style={styles.photoContainer}>
              <TouchableOpacity onPress={showImagePicker} style={styles.photoButton}>
                {newPlayerPic ? (
                  <OptimizedImage
                    source={{ uri: newPlayerPic }}
                    style={styles.playerPhoto}
                    placeholder={
                      <Avatar.Icon
                        size={80}
                        icon="account"
                        style={{ backgroundColor: COLORS.gray }}
                      />
                    }
                  />
                ) : (
                  <Avatar.Icon
                    size={80}
                    icon="camera"
                    style={{ backgroundColor: COLORS.lightgray }}
                  />
                )}
              </TouchableOpacity>
              <AppButton
                title={uploadingImage ? "Uploading..." : "Change Photo"}
                onPress={showImagePicker}
                disabled={uploadingImage}
                style={styles.changePhotoButton}
                varient="outlined"
              />
            </View>
          </View>

          {/* Other Fields */}
          {filterKeys.map((ite, i) => (
            <View key={i} >
              <AppText size={1.5} style={{ marginVertical: 10 }}>{ite.toUpperCase()}</AppText>
              <AppTextInput
                placeholder={ite}
                value={itemSelected[ite]}
                onChangeText={(t) => onChangeText(ite, t)}
              />
            </View>
          ))}
        </View>
        <AppButton title={"Update"} onPress={handleSubmit} />
      </ScrollView>
    </Dialog>
  );
};

export default EditPlayerDialog;

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
    maxHeight: "80%",
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
  photoSection: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightgray,
    paddingBottom: 15,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButton: {
    marginBottom: 10,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  playerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changePhotoButton: {
    width: 120,
    height: 36,
    paddingHorizontal: 10,
  },
});
