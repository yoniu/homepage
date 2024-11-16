"use client";
/**
 * Howler 不支持替换音频，所以只能每次对实例重新生成并挂载
 * 2024.11.12 / 油油
 */
import React, { createContext, useReducer, useContext, ReactNode } from 'react';

interface IState {
  howler?: Howl;
}

// 定义初始状态
const initialState: IState = {
  howler: undefined,
};

type TAction = 
  | { type: 'SET', howler: Howl } // 设置 Howler
  | { type: 'CLEAN' } // 清理 Howler

// 定义 reducer 函数
const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'SET':
      return { ...state, howler: action.howler };
    case 'CLEAN':
      // 如果 Howler 存在则暂停播放并卸载
      if (state.howler) {
        state.howler.stop();
        state.howler.unload();
        delete state.howler;
      }
      return { ...state };
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
