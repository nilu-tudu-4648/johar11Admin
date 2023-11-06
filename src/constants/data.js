import { NAVIGATION } from "./routes";



export const dashboardCards = [
  {
    name: "ADD PLAYER",
    navigation: NAVIGATION.ADD_PLAYER,
  },
  {
    name: "ADD TEAM",
    navigation: NAVIGATION.ADD_TEAM,
  },
  {
    name: "TOURNAMENT",
    navigation: NAVIGATION.CREATE_TOURNAMENT,
  },
  {
    name: "ALL PLAYERS",
    navigation: NAVIGATION.ALL_PLAYERS,
  },
  {
    name: "ALL TEAMS",
    navigation: NAVIGATION.ALL_TEAMS,
  },
  {
    name: "ALL USERS",
    navigation: NAVIGATION.ALL_USERS,
  },
  {
    name: "ALL MATCHES",
    navigation: NAVIGATION.ALL_TOURNAMENTS,
  },
];

export const FIRESTORE_COLLECTIONS = {
  CREATED_TEAMS: "createdTeams",
  USERS: "users",
  PLAYERS: "players",
  TEAM_NAMES: "teamNames",
  TOURNAMENTS: "tournaments",
};
