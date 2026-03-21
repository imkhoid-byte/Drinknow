import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createGameState, nextPlayer, recordDrink, recordRefusal, addShamePhoto, shouldTriggerWildcard } from './gameLogic';

const GameContext = createContext(null);

const initialState = {
  gameState: null,
  currentChallenge: null,
  showWildcard: false,
  currentWildcard: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, gameState: createGameState(action.players, action.settings) };
    case 'SET_CHALLENGE':
      return { ...state, currentChallenge: action.challenge };
    case 'NEXT_PLAYER':
      return { ...state, gameState: nextPlayer(state.gameState), currentChallenge: null };
    case 'RECORD_DRINK':
      return { ...state, gameState: recordDrink(state.gameState, action.playerId, action.sips) };
    case 'RECORD_REFUSAL':
      return { ...state, gameState: recordRefusal(state.gameState, action.playerId, action.sips) };
    case 'ADD_SHAME_PHOTO':
      return { ...state, gameState: addShamePhoto(state.gameState, action.uri, action.playerId) };
    case 'SHOW_WILDCARD':
      return { ...state, showWildcard: true, currentWildcard: action.wildcard };
    case 'DISMISS_WILDCARD':
      return { ...state, showWildcard: false, currentWildcard: null };
    case 'END_GAME':
      return { ...state, gameState: null, currentChallenge: null };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const startGame = useCallback((players, settings) => {
    dispatch({ type: 'START_GAME', players, settings });
  }, []);

  const setChallenge = useCallback((challenge) => {
    dispatch({ type: 'SET_CHALLENGE', challenge });
  }, []);

  const advanceTurn = useCallback(() => {
    dispatch({ type: 'NEXT_PLAYER' });
  }, []);

  const drinkTaken = useCallback((playerId, sips) => {
    dispatch({ type: 'RECORD_DRINK', playerId, sips });
  }, []);

  const challengeRefused = useCallback((playerId, sips) => {
    dispatch({ type: 'RECORD_REFUSAL', playerId, sips });
  }, []);

  const addShame = useCallback((uri, playerId) => {
    dispatch({ type: 'ADD_SHAME_PHOTO', uri, playerId });
  }, []);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, []);

  return (
    <GameContext.Provider value={{
      ...state,
      startGame,
      setChallenge,
      advanceTurn,
      drinkTaken,
      challengeRefused,
      addShame,
      endGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be inside GameProvider');
  return ctx;
}
