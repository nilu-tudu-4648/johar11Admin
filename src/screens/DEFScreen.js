import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import CreateTeamItemComponent from "../components/CreateTeamItemComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterPlayersForTournament,
  setPlayersForTournament,
} from "../store/playersReducer";

const DEFScreen = () => {
  const [playersArray, setplayersArray] = useState([]);
  const { players, createPlayers } = useSelector(
    (state) => state.entities.playersReducer
  );

  const dispatch = useDispatch();
  const addDEFtoStorage = async () => {
    try {
      const updatedPlayersArray = createPlayers.filter(
        (player) => player.playerType === "DEF"
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
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    addDEFtoStorage();
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

export default DEFScreen;

const styles = StyleSheet.create({});
