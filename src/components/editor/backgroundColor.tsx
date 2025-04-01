"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import { ColorPicker, Input, Select } from "antd";
import { useMemo } from "react";
import { AggregationColor } from "antd/es/color-picker/color";

export type TBackgroundColor = "solid" | "gradient" | "image" | "none";

export type TTextBackgroundColor = {
  type: TBackgroundColor;
  textColor?: string;
  color?: string;
  colors?: string[];
  image?: string;
}

export default function EditorBackgroundColor() {

  const { state, dispatch } = useEditorStateContext();

  const handleChangeTextColor = (color: AggregationColor) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        backgroundColor: {
          ...prevAttributes?.backgroundColor,
          textColor: color.toRgbString()
        }
      }
    }})
  }
  
  const handleChange = (value: TBackgroundColor) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        backgroundColor: {
          ...prevAttributes?.backgroundColor,
          type: value
        }
      }
    }})
  }

  const handleChangeColor = (color: AggregationColor) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        backgroundColor: {
          ...prevAttributes?.backgroundColor,
          type: 'solid',
          color: color.toRgbString()
        }
      }
    }})
  }

  const handleChangeGradientColor = (colors: AggregationColor) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        backgroundColor: {
          ...prevAttributes?.backgroundColor,
          type: 'gradient',
          colors: colors.getColors().map(item => `${item.color.toRgbString()} ${item.percent}%`)
        }
      }
    }})
  }

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        backgroundColor: {
          ...prevAttributes?.backgroundColor,
          type: 'image',
          image: e.target.value
        }
      }
    }})
  }
  
  const options: Array<{ label: string, value: TBackgroundColor }> = [
    {
      label: '纯色',
      value: 'solid'
    },
    {
      label: '渐变',
      value: 'gradient'
    },
    {
      label: '图片',
      value: 'image'
    },
    {
      label: '无',
      value: 'none'
    }
  ]

  const backgroundColor = useMemo<TTextBackgroundColor>(() => {
    if (state.attributes?.backgroundColor) {
      return state.attributes.backgroundColor
    } else {
      return {
        type: 'none',
      }
    }
  }, [state.attributes])

  const gradientColors = useMemo(() => {
    const colors: string[] = backgroundColor.colors ?? [];
    return colors.map(item => {
      const [color, percent] = item.split(' ');
      return {
        color: color,
        percent: +percent.replace('%', '')
      }
    })
  }, [backgroundColor])
  
  return (
    <SidebarCollapse title="背景颜色" className="flex flex-col items-start space-y-1" defaultOpen={false}>
      <span className="text-sm text-gray-500">文字颜色</span>
      <ColorPicker key="text" value={backgroundColor.textColor ?? '#000'} onChange={handleChangeTextColor} showText />
      <Select options={options} value={backgroundColor.type} onChange={handleChange} />
      {
        backgroundColor.type === 'solid' ? 
        <ColorPicker key="solid" value={backgroundColor.color} onChange={handleChangeColor} showText /> :
        backgroundColor.type === 'gradient' ? 
        <ColorPicker key="gradient" value={gradientColors} mode="gradient" onChange={handleChangeGradientColor} showText /> :
        <Input placeholder="图片链接" value={backgroundColor.image} onChange={handleChangeImage} />
      }
    </SidebarCollapse>
  )
}
