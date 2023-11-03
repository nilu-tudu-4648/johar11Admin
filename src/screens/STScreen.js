import { ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import CreateTeamItemComponent from "../components/CreateTeamItemComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterPlayersForTournament,
  setPlayersForTournament,
} from "../store/playersReducer";
import { NAVIGATION } from "../constants/routes";
import { AppButton, PriviewDialog } from "../components";
import { COLORS, FSTYLES } from "../constants/theme";
import { showToast } from "../constants/functions";

const STScreen = ({ navigation }) => {
  const [playersArray, setplayersArray] = useState([]);
  const [visible, setvisible] = useState(false);
  const { players, createPlayers } = useSelector(
    (state) => state.entities.playersReducer
  );
  const dispatch = useDispatch();
  const addSTtoStorage = async () => {
    try {
      const updatedPlayersArray = createPlayers.filter(
        (player) => player.playerType === "ST"
      );
      setplayersArray(updatedPlayersArray);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addPlayerstoTeamFunc = async (item) => {
    try {
      const playerExists = playersArray.find(
        (ite) => ite.name === item.name && ite.isActive
      );
      const updatedPlayers = playersArray.map((player) =>
        player.name === item.name
          ? { ...player, isActive: !player.isActive }
          : player
      );
      const deselectedPlayer = players.filter((ite) => ite.name !== item.name);
      if (deselectedPlayer) {
        dispatch(setFilterPlayersForTournament(deselectedPlayer));
      }
      setplayersArray(updatedPlayers);
      if (!playerExists) {
        dispatch(setPlayersForTournament(item));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    addSTtoStorage();
  }, []);
  const NextButton = () => {
    if (players.length === 11) {
      navigation.navigate(NAVIGATION.SELECT_CAPTAIN);
    } else {
      showToast("Please select 11 players");
    }
  };
  return (
    <>
      <ScrollView>
        {playersArray.map((item, index) => (
          <CreateTeamItemComponent
            key={index}
            item={item}
            addPlayerstoTeamFunc={addPlayerstoTeamFunc}
          />
        ))}
      </ScrollView>
      <View style={{ ...FSTYLES, justifyContent: "space-around", bottom: 12 }}>
        <AppButton
          title="Preview"
          onPress={() => setvisible(true)}
          style={{ borderRadius: 20, width: 150 }}
        />
        <AppButton
          title="Next"
          onPress={NextButton}
          style={{
            borderRadius: 20,
            width: 150,
            backgroundColor: COLORS.green,
          }}
        />
      </View>
      <PriviewDialog
        visible={visible}
        players={players}
        setvisible={setvisible}
      />
    </>
  );
};

export default STScreen;

const styles = StyleSheet.create({});
