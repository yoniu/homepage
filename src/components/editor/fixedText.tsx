"use client";

import { App, Button, Input, Select } from "antd";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import SidebarCollapse from "@/src/components/editor/collapse";
import { nanoid } from "@udecode/plate-common";
import { useState } from "react";

export enum EFixedTextType {
  PLAIN,
  ORANGE,
}

export interface IFixedTextItem {
  id: string; // id
  content: string; // 内容
  top: string; // 顶部位置 百分比 “90”%
  left: string; // 左边位置 百分比 “90”%
  type: EFixedTextType;
}

/**
 * 浮动文字
 * @returns 
 */
export default function EditorFixedText() {

  const { state, dispatch } = useEditorStateContext();

  const handleAddFixedText = () => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        fixedText: [
          ...state.attributes?.fixedText ?? [],
          {
            id: nanoid(),
            content: '',
            top: '10',
            left: '10',
            type: EFixedTextType.PLAIN,
          }
        ]
      }
    }});
  }
  
  return (
    <SidebarCollapse title="浮动文字" className="space-y-1">
      <div className="flex flex-col space-y-2">
        {
          state.attributes && state.attributes.fixedText && (state.attributes.fixedText as IFixedTextItem[]).map(item => (
            <ItemInput key={item.id} {...item} />
          ))
        }
        <div className="flex items-center space-x-1">
          <Button onClick={handleAddFixedText}>添加浮动文字</Button>
        </div>
      </div>
    </SidebarCollapse>
  )
}

const ItemInput = ({ id, content: _content, top: _top, left: _left, type: _type }: IFixedTextItem) => {

  const { message } = App.useApp();
  const { state, dispatch } = useEditorStateContext();

  const [content, setContent] = useState(_content);
  const [top, setTop] = useState(_top);
  const [left, setLeft] = useState(_left);
  const [type, setType] = useState(_type);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
  }
  const handleTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTop(e.target.value)
  }
  const handleLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeft(e.target.value)
  }
  const handleTypeChange = (type: EFixedTextType) => {
    setType(type as EFixedTextType)
  }

  const handleUpdate = () => {
    if (content === '' || top === '' || left === '' || type === null) {
      return message.error('内容、位置、类型不能为空')
    }
    if ((Number(top) > 100 || Number(top) < 0) || (Number(left)>100 || Number(left) < 0)) {
      return message.error('位置必须是0-100的数字')
    }
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        fixedText: ((prevAttributes?.fixedText ?? []) as IFixedTextItem[]).map(item => {
          if (item.id === id) {
            return {
              ...item,
              content,
              top,
              left,
              type,
            }
          }
          return item;
        })
      }
    }})
    message.success('更新成功')
  }

  const handleDelete = () => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        fixedText: ((prevAttributes?.fixedText ?? []) as IFixedTextItem[]).filter(item => item.id !== id)
      }
    }})
  }

  return (
  <div className="flex flex-col space-y-1 py-2 rounded border-t border-b">
    <Input className="flex-grow" addonBefore="内容" value={content} onChange={handleContentChange} />
    <div className="flex items-center space-x-1">
      <Input className="flex-grow" addonBefore="上" value={top} onChange={handleTopChange} />
      <Input className="flex-grow" addonBefore="左" value={left} onChange={handleLeftChange} />
    </div>
    <Select className="flex-grow" value={type} onChange={handleTypeChange}>
      <Select.Option value={EFixedTextType.PLAIN}>白色浮动文字</Select.Option>
      <Select.Option value={EFixedTextType.ORANGE}>橙色底色文字</Select.Option>
    </Select>
    <div className="flex items-center justify-end space-x-1">
      <Button size="small" onClick={handleUpdate}>更新</Button>
      <Button size="small" danger onClick={handleDelete}>删除</Button>
    </div>
  </div>
  )
}

export const ShowFixedText = ({ fixedText }: {fixedText: IFixedTextItem[]}) => {
  return (
    <>
      {
        fixedText.map(item => {
          if (item.type === EFixedTextType.ORANGE) {
            return orangeText(item)
          } else {
            return plainText(item)
          }
        })
      }
    </>
  )
}

const plainText = (item: IFixedTextItem) => (
  <span
    className="absolute text-lg md:text-xl fixed-text_plain"
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
)

const orangeText = (item: IFixedTextItem) => (
  <span
    className="absolute text-lg md:text-xl bg-orange-400 py-1 px-2 text-white"
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
)

