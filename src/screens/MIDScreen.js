import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import CreateTeamItemComponent from "../components/CreateTeamItemComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterPlayersForTournament,
  setPlayersForTournament,
} from "../store/playersReducer";

const MIDScreen = () => {
  const [playersArray, setplayersArray] = useState([]);
  const { players, createPlayers } = useSelector(
    (state) => state.entities.playersReducer
  );
  const dispatch = useDispatch();
  const addMIDtoStorage = async () => {
    try {
      const updatedPlayersArray = createPlayers.filter(
        (player) => player.playerType === "MID"
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
    addMIDtoStorage();
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

export default MIDScreen;

const styles = StyleSheet.create({});
