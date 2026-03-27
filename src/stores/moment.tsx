"use client";
/**
 * Moment Store
 * 2024.11.17 / 油
 */
import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";

import consts from "@/src/configs/consts";

export type TDisplayType = "tiktok" | "masonry";

interface IState {
  loading: boolean;
  currentIndex: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  momentList: IMomentItem[];
  displayType: TDisplayType;
}

const DEFAULT_DISPLAYTYPE: TDisplayType = "tiktok";

function isDisplayType(value: string | null): value is TDisplayType {
  return value === "tiktok" || value === "masonry";
}

function getStoredDisplayType(): TDisplayType | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDisplayType = window.localStorage.getItem(consts.LS_DISPLAYTYPE);
  return isDisplayType(storedDisplayType) ? storedDisplayType : null;
}

function persistDisplayType(displayType: TDisplayType) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(consts.LS_DISPLAYTYPE, displayType);
}

const initialState: IState = {
  loading: false,
  currentIndex: 0,
  page: 1,
  pageSize: 12,
  hasNextPage: false,
  momentList: [],
  displayType: DEFAULT_DISPLAYTYPE,
};

type TAction =
  | { type: "UPDATELIST"; momentList: IMomentItem[]; page: number; hasNextPage: boolean }
  | { type: "PREVINDEX" }
  | { type: "NEXTINDEX" }
  | { type: "SETINDEX"; index: number }
  | { type: "SETLOADING"; state: boolean }
  | { type: "RESETFEED" }
  | { type: "SETDISPLAYTYPE"; displayType: TDisplayType };

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case "UPDATELIST":
      return { ...state, momentList: action.momentList, page: action.page, hasNextPage: action.hasNextPage };
    case "PREVINDEX":
      return state.currentIndex > 0 ? { ...state, currentIndex: state.currentIndex - 1 } : state;
    case "NEXTINDEX":
      return state.currentIndex < state.momentList.length - 1
        ? { ...state, currentIndex: state.currentIndex + 1 }
        : state;
    case "SETINDEX":
      return { ...state, currentIndex: action.index };
    case "SETLOADING":
      return { ...state, loading: action.state };
    case "RESETFEED":
      return {
        ...state,
        loading: false,
        currentIndex: 0,
        page: 1,
        hasNextPage: false,
        momentList: [],
      };
    case "SETDISPLAYTYPE":
      if (state.displayType === action.displayType) {
        return state;
      }

      persistDisplayType(action.displayType);
      return { ...state, displayType: action.displayType, currentIndex: 0 };
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

  useEffect(() => {
    const storedDisplayType = getStoredDisplayType();

    if (storedDisplayType && storedDisplayType !== DEFAULT_DISPLAYTYPE) {
      dispatch({ type: "SETDISPLAYTYPE", displayType: storedDisplayType });
    }
  }, []);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};

export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);

  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }

  return context;
};
