import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
const initialState = {
  loading: false,
  allusers: [],
  allPlayers: [],
  allMatches: [],
  allTeams: [],
};

const adminReducer = createSlice({
  name: "adminReducer",
  initialState,
  reducers: {
    setAllUsers: (adminReducer, action) => {
      adminReducer.allusers = action.payload;
    },
    setAllPlayers: (adminReducer, action) => {
      adminReducer.allPlayers = action.payload;
    },
    setAllMatches: (adminReducer, action) => {
      adminReducer.allMatches = action.payload;
    },
    setAllTeams: (adminReducer, action) => {
      adminReducer.allTeams = action.payload;
    },
  },
});

export default adminReducer.reducer;
export const { setAllUsers, setAllPlayers, setAllMatches,setAllTeams } =
  adminReducer.actions;
