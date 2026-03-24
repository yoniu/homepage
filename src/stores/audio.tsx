"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from 'react';

type THowl = InstanceType<(typeof import('howler'))['Howl']>;

interface IState {
  howler?: THowl;
  muted: boolean;
}

const MEDIA_MUTED_STORAGE_KEY = 'homepage:media-muted';

export function disposeHowler(howler?: THowl | null) {
  if (!howler) {
    return;
  }

  howler.stop();
  howler.unload();
}

const initialState: IState = {
  howler: undefined,
  muted: true,
};

type TAction =
  | { type: 'SET'; howler: THowl }
  | { type: 'CLEAN' }
  | { type: 'CLEAN_MATCH'; howler: THowl }
  | { type: 'SET_MUTED'; muted: boolean };

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'SET':
      if (state.howler && state.howler !== action.howler) {
        disposeHowler(state.howler);
      }

      action.howler.mute(state.muted);
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
    case 'SET_MUTED':
      state.howler?.mute(action.muted);
      return { ...state, muted: action.muted };
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
  const [preferenceReady, setPreferenceReady] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(MEDIA_MUTED_STORAGE_KEY);
    if (storedValue !== null) {
      dispatch({
        type: 'SET_MUTED',
        muted: storedValue === 'true',
      });
    }

    setPreferenceReady(true);
  }, []);

  useEffect(() => {
    if (!preferenceReady) {
      return;
    }

    window.localStorage.setItem(MEDIA_MUTED_STORAGE_KEY, String(state.muted));
  }, [preferenceReady, state.muted]);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }

  return context;
};
