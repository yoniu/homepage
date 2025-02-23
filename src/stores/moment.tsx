"use client";
/**
 * Moment Store
 * 2024.11.17 / 油油
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface IState {
  loading: boolean;
  currentIndex: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  momentList: IMomentItem<any>[];
  displayType: "tiktok" | "masonry";
}

// 定义初始状态
const initialState: IState = {
  loading: false,
  currentIndex: 0,
  page: 1,
  pageSize: 6,
  hasNextPage: false,
  momentList: [],
  displayType: "tiktok",
};

type TAction = 
  | { type: 'UPDATELIST', momentList: IMomentItem<any>[], page: number, hasNextPage: boolean } // 更新 list
  | { type: 'PREVINDEX' } // 上一条
  | { type: 'NEXTINDEX' } // 下一条
  | { type: 'SETINDEX', index: number } // 切换 index
  | { type: 'SETLOADING', state: boolean } // Loading
  | { type: 'SETDISPLAYTYPE', displayType: "tiktok" | "masonry" } // 切换显示类型

// 定义 reducer 函数
const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'UPDATELIST':
      return { ...state, momentList: action.momentList, page: action.page, hasNextPage: action.hasNextPage };
    case 'PREVINDEX':
      if (state.currentIndex > 0)
        return { ...state, currentIndex: state.currentIndex - 1 };
      else
        return state;
    case 'NEXTINDEX':
      if (state.currentIndex < state.momentList.length - 1)
        return { ...state, currentIndex: state.currentIndex + 1 };
      else
        return state;
    case 'SETINDEX':
      console.log(action.index)
      return {...state, currentIndex: action.index };
    case 'SETLOADING':
      return { ...state, loading: action.state };
    case 'SETDISPLAYTYPE':
      return {...state, displayType: action.displayType, currentIndex: 0 };
    default:
      return state;
  }
};

// 定义 Context 类型
interface StateContextProps {
  state: IState;
  dispatch: React.Dispatch<TAction>;
}

// 创建上下文
const StateContext = createContext<StateContextProps | undefined>(undefined);

// 创建 Provider 组件
interface StateProviderProps {
  children: ReactNode;
}

export const StateProvider: React.FC<StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// 自定义 Hook，用于在组件中使用上下文
export const useStateContext = (): StateContextProps => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateProvider');
  }
  return context;
};
