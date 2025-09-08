"use client";
/**
 * User Store
 * 2024.11.13 / 油油
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { logged } from '@/src/utils/login';

interface IState {
  isLogin: boolean;
  menuShow: boolean;
}

// 定义初始状态
const initialState: IState = {
  isLogin: false,
  menuShow: false,
};

type TAction = 
  | { type: 'UPDATELOGIN' } // 更新登录状态
  | { type: 'SETMENUSHOW', show: boolean } // 设置菜单显示状态

// 定义 reducer 函数
const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'UPDATELOGIN':
      return { ...state, isLogin: logged() };
    case 'SETMENUSHOW':
      return { ...state, menuShow: action.show };
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
