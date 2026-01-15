import { useMemo } from "react";
import { App, ColorPicker, Select } from "antd";

import SidebarCollapse from "../collapse";

import EditorMusic from "@/src/components/editor/music";
import Upload, { IFileItem } from "@/src/components/editor/Upload";
import EditorPlainContent from "@/src/components/editor/plainContent";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

import { TMusicMomentAttributes, TMusicMomentBackgroundType, TTextType } from "@/src/types/moments";
import { AggregationColor } from "antd/es/color-picker/color";

function MusicBackgroundSetting() {

  const { state, dispatch } = useEditorStateContext();

  const musicAttributes = state.attributes as TMusicMomentAttributes;

  const textType = useMemo(() => musicAttributes?.textType ?? "LIGHT", [musicAttributes]);
  const backgroundType = useMemo(() => musicAttributes?.backgroundType ?? "DEFAULT", [musicAttributes]);
  const backgroundColor = useMemo(() => musicAttributes?.backgroundColor ?? "#000000", [musicAttributes]);
  const gradientColors = useMemo(() => musicAttributes?.gradientColors?.map(item => {
    const [color, percent] = item.split(' ');
    return {
      color: color,
      percent: +percent.replace('%', '')
    }
  }) ?? [], [musicAttributes]);

  const handleTypeChange = (value: TMusicMomentBackgroundType) => {
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...musicAttributes,
        backgroundType: value,
      }
    }});
  }

  const handleChangeColor = (value: AggregationColor) => {
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...musicAttributes,
        backgroundColor: value.toRgbString(),
      }
    }});
  }

  const handleChangeGradientColor = (colors: AggregationColor) => {
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...musicAttributes,
        gradientColors: colors.getColors().map(item => `${item.color.toRgbString()} ${item.percent}%`),
      }
    }});
  }

  const handleTextTypeChange = (value: TTextType) => {
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...musicAttributes,
        textType: value,
      }
    }});
  }

  const textTypes: { value: TTextType, label: string }[] = [
    {
      value: "LIGHT",
      label: '文字：亮色',
    },
    {
      value: "DARK",
      label: '文字：暗色',
    },
  ]

  const backgroundTypes: { value: TMusicMomentBackgroundType, label: string }[] = [
    {
      value: "DEFAULT",
      label: '背景：默认背景',
    },
    {
      value: "PLAIN",
      label: '背景：纯色',
    },
    {
      value: "GRADIENT",
      label: '背景：渐变',
    },
  ]

  return (
    <SidebarCollapse title="配色设置" className="flex flex-col items-start space-y-1" defaultOpen={true}>
      <Select className="flex-grow" value={textType} onChange={handleTextTypeChange}>
        { textTypes.map(type => (
          <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
        )) }
      </Select>
      <Select className="flex-grow" value={backgroundType} onChange={handleTypeChange}>
        { backgroundTypes.map(type => (
          <Select.Option key={type.value} value={type.value}>{type.label}</Select.Option>
        )) }
      </Select>
      {
        backgroundType === "PLAIN" && (
          <ColorPicker key="solid" value={backgroundColor} onChange={handleChangeColor} showText />
        )
      }
      {
        backgroundType === "GRADIENT" && (
          <ColorPicker key="gradient" value={gradientColors} mode="gradient" onChange={handleChangeGradientColor} showText />
        )
      }
    </SidebarCollapse>
  )
}

export default function MusicEditorSidebar() {

  const { message } = App.useApp();

  const handleClickUploadFileItem = (item: IFileItem<any>) => {
    // 复制图片 url
    navigator.clipboard.writeText(item.url);
    // 提示用户复制成功
    message.success('文件 URL 已复制到剪贴板');
  }

  return (
    <>
      <EditorPlainContent />
      <Upload title="上传文件" onClickItem={handleClickUploadFileItem} />
      <EditorMusic />
      <MusicBackgroundSetting />
    </>
  )
}
