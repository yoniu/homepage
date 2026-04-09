import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, ColorPicker, Input, Select, Slider } from "antd";
import { AggregationColor } from "antd/es/color-picker/color";
import { useMemo } from "react";

import SidebarCollapse from "../collapse";

import EditorMusic from "@/src/components/editor/music";
import Upload, { IFileItem } from "@/src/components/editor/Upload";
import EditorPlainContent from "@/src/components/editor/plainContent";
import { getMusicBackgroundIconEntries } from "@/src/components/music/DecorativeBackground";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import {
  TMusicMomentAttributes,
  TMusicMomentBackgroundType,
  TMusicBackgroundIconEntry,
  TMusicBackgroundIconPlacement,
  TTextType,
} from "@/src/types/moments";

const { TextArea } = Input;

function getDefaultCoverageHeight(placement: TMusicBackgroundIconPlacement) {
  return placement === "FULL" ? 100 : 50;
}

function MusicBackgroundSetting() {
  const { state, dispatch } = useEditorStateContext();
  const musicAttributes = state.attributes as TMusicMomentAttributes;

  const textType = useMemo(() => musicAttributes?.textType ?? "LIGHT", [musicAttributes]);
  const backgroundType = useMemo(() => musicAttributes?.backgroundType ?? "DEFAULT", [musicAttributes]);
  const backgroundColor = useMemo(() => musicAttributes?.backgroundColor ?? "#000000", [musicAttributes]);
  const gradientColors = useMemo(
    () =>
      musicAttributes?.gradientColors?.map((item) => {
        const [color, percent] = item.split(" ");
        return {
          color,
          percent: +percent.replace("%", ""),
        };
      }) ?? [],
    [musicAttributes],
  );

  const updateAttributes = (patch: Partial<TMusicMomentAttributes>) => {
    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...musicAttributes,
          ...patch,
        },
      },
    });
  };

  const handleTypeChange = (value: TMusicMomentBackgroundType) => {
    updateAttributes({
      backgroundType: value,
    });
  };

  const handleChangeColor = (value: AggregationColor) => {
    updateAttributes({
      backgroundColor: value.toRgbString(),
    });
  };

  const handleChangeGradientColor = (colors: AggregationColor) => {
    updateAttributes({
      gradientColors: colors.getColors().map((item) => `${item.color.toRgbString()} ${item.percent}%`),
    });
  };

  const handleTextTypeChange = (value: TTextType) => {
    updateAttributes({
      textType: value,
    });
  };

  const textTypes: { value: TTextType; label: string }[] = [
    { value: "LIGHT", label: "文字：亮色" },
    { value: "DARK", label: "文字：暗色" },
  ];

  const backgroundTypes: { value: TMusicMomentBackgroundType; label: string }[] = [
    { value: "DEFAULT", label: "背景：默认背景" },
    { value: "PLAIN", label: "背景：纯色" },
    { value: "GRADIENT", label: "背景：渐变" },
  ];

  return (
    <SidebarCollapse title="配色设置" className="flex flex-col items-start space-y-2" defaultOpen={true}>
      <Select className="w-full" value={textType} onChange={handleTextTypeChange}>
        {textTypes.map((type) => (
          <Select.Option key={type.value} value={type.value}>
            {type.label}
          </Select.Option>
        ))}
      </Select>
      <Select className="w-full" value={backgroundType} onChange={handleTypeChange}>
        {backgroundTypes.map((type) => (
          <Select.Option key={type.value} value={type.value}>
            {type.label}
          </Select.Option>
        ))}
      </Select>
      {backgroundType === "PLAIN" && (
        <ColorPicker key="solid" value={backgroundColor} onChange={handleChangeColor} showText />
      )}
      {backgroundType === "GRADIENT" && (
        <ColorPicker
          key="gradient"
          value={gradientColors}
          mode="gradient"
          onChange={handleChangeGradientColor}
          showText
        />
      )}
    </SidebarCollapse>
  );
}

function MusicBackgroundIconSetting() {
  const { state, dispatch } = useEditorStateContext();
  const musicAttributes = state.attributes as TMusicMomentAttributes;

  const backgroundIcons = useMemo(
    () => getMusicBackgroundIconEntries(musicAttributes, { preserveEmpty: true }),
    [musicAttributes],
  );

  const updateAttributes = (patch: Partial<TMusicMomentAttributes>) => {
    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...musicAttributes,
          ...patch,
        },
      },
    });
  };

  const updateBackgroundIcons = (nextIcons: TMusicBackgroundIconEntry[]) => {
    updateAttributes({
      backgroundIcons: nextIcons.length ? nextIcons : undefined,
      backgroundIconPlacement: undefined,
      backgroundIconCoverageHeight: undefined,
    });
  };

  const handleAddBackgroundIcon = () => {
    updateBackgroundIcons([
      ...backgroundIcons,
      {
        content: "",
        placement: "FULL",
        coverageHeight: 100,
      },
    ]);
  };

  const handleRemoveBackgroundIcon = (index: number) => {
    updateBackgroundIcons(backgroundIcons.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleChangeBackgroundIcon = (index: number, value: string) => {
    const nextIcons = [...backgroundIcons];
    nextIcons[index] = {
      ...nextIcons[index],
      content: value,
    };
    updateBackgroundIcons(nextIcons);
  };

  const handlePlacementChange = (index: number, value: TMusicBackgroundIconPlacement) => {
    const nextIcons = [...backgroundIcons];
    const currentIcon = nextIcons[index];
    const currentPlacement = currentIcon?.placement ?? "FULL";
    const currentCoverageHeight = currentIcon?.coverageHeight ?? getDefaultCoverageHeight(currentPlacement);
    const nextCoverageHeight =
      currentCoverageHeight === getDefaultCoverageHeight(currentPlacement)
        ? getDefaultCoverageHeight(value)
        : currentCoverageHeight;

    nextIcons[index] = {
      ...currentIcon,
      placement: value,
      coverageHeight: nextCoverageHeight,
    };

    updateBackgroundIcons(nextIcons);
  };

  const handleCoverageHeightChange = (index: number, value: number | number[]) => {
    if (Array.isArray(value)) {
      return;
    }

    const nextIcons = [...backgroundIcons];
    nextIcons[index] = {
      ...nextIcons[index],
      coverageHeight: value,
    };
    updateBackgroundIcons(nextIcons);
  };

  const placementOptions: { value: TMusicBackgroundIconPlacement; label: string }[] = [
    { value: "FULL", label: "整层居中" },
    { value: "TOP", label: "上半部分" },
    { value: "BOTTOM", label: "下半部分" },
  ];

  return (
    <SidebarCollapse title="背景图标" className="space-y-3" defaultOpen={true}>
      <div className="rounded-md border border-dashed border-gray-300 p-3 text-xs leading-6 text-gray-500">
        每一项背景图标都可以单独填写 SVG 或 emoji，并单独设置显示区域和覆盖高度。
      </div>

      <div className="space-y-2">
        {backgroundIcons.length === 0 && (
          <div className="rounded-md border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-400">
            还没有背景图标，点下面按钮新增一个。
          </div>
        )}

        {backgroundIcons.map((icon, index) => (
          <div key={`music-bg-icon-${index}`} className="space-y-3 rounded-md border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">图标 {index + 1}</span>
              <Button
                danger
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveBackgroundIcon(index)}
              >
                删除
              </Button>
            </div>

            <TextArea
              value={icon.content}
              autoSize={{ minRows: 3, maxRows: 10 }}
              onChange={(event) => handleChangeBackgroundIcon(index, event.target.value)}
              placeholder="粘贴 SVG 代码，或输入一个 emoji，例如 ⭐"
            />

            <div className="space-y-1">
              <div className="text-xs text-gray-500">显示区域</div>
              <Select
                className="w-full"
                value={icon.placement ?? "FULL"}
                onChange={(value) => handlePlacementChange(index, value)}
                options={placementOptions}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>覆盖高度</span>
                <span>{icon.coverageHeight ?? getDefaultCoverageHeight(icon.placement ?? "FULL")}%</span>
              </div>
              <Slider
                min={10}
                max={100}
                value={icon.coverageHeight ?? getDefaultCoverageHeight(icon.placement ?? "FULL")}
                onChange={(value) => handleCoverageHeightChange(index, value)}
                tooltip={{ formatter: (value) => `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <Button block icon={<PlusOutlined />} onClick={handleAddBackgroundIcon}>
        新增背景图标
      </Button>
    </SidebarCollapse>
  );
}

export default function MusicEditorSidebar() {
  const { message } = App.useApp();

  const handleClickUploadFileItem = async (item: IFileItem) => {
    try {
      await navigator.clipboard.writeText(item.url);
      message.success("文件 URL 已复制到剪贴板");
    } catch {
      message.error("复制失败，请手动复制文件 URL");
    }
  };

  return (
    <>
      <EditorPlainContent />
      <Upload title="上传文件" type="*" onClickItem={handleClickUploadFileItem} />
      <EditorMusic />
      <MusicBackgroundSetting />
      <MusicBackgroundIconSetting />
    </>
  );
}
