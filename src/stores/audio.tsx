"use client";

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

interface IState {
  howler?: Howl;
}

export function disposeHowler(howler?: Howl | null) {
  if (!howler) {
    return;
  }

  howler.stop();
  howler.unload();
}

const initialState: IState = {
  howler: undefined,
};

type TAction =
  | { type: 'SET'; howler: Howl }
  | { type: 'CLEAN' }
  | { type: 'CLEAN_MATCH'; howler: Howl };

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'SET':
      if (state.howler && state.howler !== action.howler) {
        disposeHowler(state.howler);
      }

      return { ...state, howler: action.howler };
    case 'CLEAN':
      disposeHowler(state.howler);
      return { ...state, howler: undefined };
    case 'CLEAN_MATCH':
      if (state.howler !== action.howler) {
        return state;
      }

      disposeHowler(state.howler);
      return { ...state, howler: undefined };
    default:
      return state;
  }
};

interface StateContextProps {
  state: IState;
  dispatch: React.Dispatch<TAction>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }

  return context;
};
