"use client";
/**
 * Editor Store
 * 2024.11.16 / 油油
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

type TState = Partial<IMomentItem<any>>

// 定义初始状态
const initialState: TState = {};

type TAction = 
  | { type: 'UPDATE', states: TState } // 更新状态

// 定义 reducer 函数
const reducer = (state: TState, action: TAction): TState => {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, ...action.states };
    default:
      return state;
  }
};

// 定义 Context 类型
interface StateContextProps {
  state: TState;
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
