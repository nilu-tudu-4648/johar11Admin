import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import CreateTeamItemComponent from "../components/CreateTeamItemComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterPlayersForTournament,
  setPlayersForTournament,
} from "../store/playersReducer";
import { showToast } from "../constants/functions";

const GKScreen = () => {
  const [playersArray, setplayersArray] = useState([]);
  const { players, createPlayers } = useSelector(
    (state) => state.entities.playersReducer
  );
  const dispatch = useDispatch();
  const addGKtoStorage = async () => {
    try {
      const updatedPlayersArray = createPlayers.filter(
        (player) => player.playerType === "GK"
      );
      setplayersArray(updatedPlayersArray);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addPlayerstoTeamFunc = async (item) => {
    try {
      const playerExists = players.find((ite) => ite.name === item.name);
      const updatedPlayers = playersArray.map((player) =>
        player.name === item.name
          ? { ...player, isActive: !player.isActive }
          : player
      );
      const selectedPlayers = updatedPlayers.filter(
        (player) => player.isActive
      );
      if (selectedPlayers.length > 1) {
        showToast("You can only select 1 player");
        return;
      }
      const deselectedPlayer = players.filter((ite) => ite.name !== item.name);
      if (deselectedPlayer) {
        dispatch(setFilterPlayersForTournament(deselectedPlayer));
      }
      setplayersArray(updatedPlayers);
      if (playerExists) {
        console.log("Player already exists in the team");
      } else {
        dispatch(setPlayersForTournament(item));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    addGKtoStorage();
  }, []);
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
    </>
  );
};

export default GKScreen;

const styles = StyleSheet.create({});
