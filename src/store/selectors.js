import { createSelector } from '@reduxjs/toolkit';

// Base selectors
const selectAdmin = (state) => state.entities.adminReducer;
const selectUser = (state) => state.entities.userReducer;
const selectPlayers = (state) => state.entities.playersReducer;

// Memoized admin selectors
export const selectAllMatches = createSelector(
  [selectAdmin],
  (admin) => admin.allMatches || []
);

export const selectAllUsers = createSelector(
  [selectAdmin],
  (admin) => admin.allusers || []
);

export const selectAllPlayers = createSelector(
  [selectAdmin],
  (admin) => admin.allPlayers || []
);

export const selectAllTeams = createSelector(
  [selectAdmin],
  (admin) => admin.allTeams || []
);

// Memoized user selectors
export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.user
);

export const selectUserLoggedIn = createSelector(
  [selectUser],
  (user) => user.userLoggedIn
);

export const selectTournaments = createSelector(
  [selectUser],
  (user) => user.tournaments || []
);

// Memoized players selectors
export const selectCreatedPlayers = createSelector(
  [selectPlayers],
  (players) => players.createPlayers || []
);

export const selectLeaderBoard = createSelector(
  [selectPlayers],
  (players) => players.leaderBoard || []
);

// Complex memoized selectors
export const selectCompletedMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter(match => match.status === 'completed')
);

export const selectUpcomingMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter(match => match.status === 'upcoming')
);

export const selectOngoingMatches = createSelector(
  [selectAllMatches],
  (matches) => matches.filter(match => match.status === 'ongoing')
);

// Search selector factory
export const makeSelectFilteredMatches = () => createSelector(
  [selectAllMatches, (state, query) => query],
  (matches, query) => {
    if (!query) return matches;
    const lowercaseQuery = query.toLowerCase();
    return matches.filter(item =>
      item.firstTeamName?.toLowerCase().includes(lowercaseQuery) ||
      item.secondTeamName?.toLowerCase().includes(lowercaseQuery)
    );
  }
);
