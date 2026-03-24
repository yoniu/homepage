"use client";

import { App, Button, Input, Select } from "antd";
import { nanoid } from "@udecode/plate-common";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import SidebarCollapse from "@/src/components/editor/collapse";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

import "@/src/styles/fixedText.scss";

export enum EFixedTextType {
  PLAIN,
  ORANGE,
  SANTACLAUS,
  SANTAPLANE,
}

export interface IFixedTextItem {
  id: string;
  content: string;
  top: string;
  left: string;
  type: EFixedTextType;
}

interface EditorFixedTextProps {
  scope?: "moment" | "photoset";
}

interface ItemInputProps extends IFixedTextItem {
  onDelete: (id: string) => void;
  onUpdate: (item: IFixedTextItem) => void;
}

const DEFAULT_FIXED_TEXT_ITEM = {
  content: "",
  top: "10",
  left: "10",
  type: EFixedTextType.PLAIN,
} satisfies Omit<IFixedTextItem, "id">;

export default function EditorFixedText({
  scope = "moment",
}: EditorFixedTextProps) {
  const { message } = App.useApp();
  const { state, dispatch } = useEditorStateContext();

  const photosets = useMemo(
    () => (state.attributes?.photosets ?? []) as IPhotosetItem[],
    [state.attributes?.photosets]
  );
  const legacyFixedText = useMemo(
    () => (state.attributes?.fixedText ?? []) as IFixedTextItem[],
    [state.attributes?.fixedText]
  );
  const selectedPhotosetId = state.selectedPhotosetId;

  useEffect(() => {
    if (scope !== "photoset") {
      return;
    }

    if (!photosets.length) {
      if (selectedPhotosetId !== undefined) {
        dispatch({
          type: "UPDATE",
          states: {
            selectedPhotosetId: undefined,
          },
        });
      }
      return;
    }

    const hasSelectedPhotoset = photosets.some(
      (item) => item.id === selectedPhotosetId
    );

    if (!hasSelectedPhotoset) {
      dispatch({
        type: "UPDATE",
        states: {
          selectedPhotosetId: photosets[0].id,
        },
      });
    }
  }, [dispatch, photosets, scope, selectedPhotosetId]);

  const selectedPhotoset = useMemo(() => {
    if (scope !== "photoset") {
      return null;
    }

    return (
      photosets.find((item) => item.id === selectedPhotosetId) ?? photosets[0] ?? null
    );
  }, [photosets, scope, selectedPhotosetId]);

  const fixedTextItems = useMemo(() => {
    if (scope === "photoset") {
      return resolveImageFixedText(selectedPhotoset, legacyFixedText);
    }

    return legacyFixedText;
  }, [legacyFixedText, scope, selectedPhotoset]);

  const updateFixedTextItems = (updater: (items: IFixedTextItem[]) => IFixedTextItem[]) => {
    const prevAttributes = state.attributes ?? null;

    if (scope === "photoset") {
      if (!selectedPhotoset) {
        message.warning("Please upload an image first.");
        return;
      }

      const nextPhotosets = photosets.map((item) => {
        if (item.id !== selectedPhotoset.id) {
          return item;
        }

        return {
          ...item,
          fixedText: updater(resolveImageFixedText(item, legacyFixedText)),
        };
      });

      dispatch({
        type: "UPDATE",
        states: {
          attributes: {
            ...prevAttributes,
            photosets: nextPhotosets,
          },
        },
      });

      return;
    }

    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          fixedText: updater(legacyFixedText),
        },
      },
    });
  };

  const handleAddFixedText = () => {
    if (scope === "photoset" && !selectedPhotoset) {
      message.warning("Please upload an image first.");
      return;
    }

    updateFixedTextItems((items) => [
      ...items,
      {
        id: nanoid(),
        ...DEFAULT_FIXED_TEXT_ITEM,
      },
    ]);
  };

  const handleUpdateFixedText = (nextItem: IFixedTextItem) => {
    updateFixedTextItems((items) =>
      items.map((item) => (item.id === nextItem.id ? nextItem : item))
    );
  };

  const handleDeleteFixedText = (id: string) => {
    updateFixedTextItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <SidebarCollapse title="Fixed Text" className="space-y-2">
      {scope === "photoset" ? (
        photosets.length ? (
          <Select
            className="w-full"
            value={selectedPhotoset?.id}
            onChange={(value) =>
              dispatch({
                type: "UPDATE",
                states: {
                  selectedPhotosetId: value,
                },
              })
            }
            options={photosets.map((item, index) => ({
              label: item.name || `Image ${index + 1}`,
              value: item.id,
            }))}
            placeholder="Select image"
          />
        ) : (
          <div className="rounded-md border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500">
            Upload an image before adding fixed text.
          </div>
        )
      ) : null}

      <div className="flex flex-col space-y-2">
        {fixedTextItems.map((item) => (
          <ItemInput
            key={`${selectedPhotoset?.id ?? "moment"}-${item.id}`}
            {...item}
            onDelete={handleDeleteFixedText}
            onUpdate={handleUpdateFixedText}
          />
        ))}
        <div className="flex items-center space-x-1">
          <Button onClick={handleAddFixedText} disabled={scope === "photoset" && !selectedPhotoset}>
            Add Fixed Text
          </Button>
        </div>
      </div>
    </SidebarCollapse>
  );
}

const ItemInput = ({
  id,
  content: initialContent,
  top: initialTop,
  left: initialLeft,
  type: initialType,
  onDelete,
  onUpdate,
}: ItemInputProps) => {
  const { message } = App.useApp();

  const [content, setContent] = useState(initialContent);
  const [top, setTop] = useState(initialTop);
  const [left, setLeft] = useState(initialLeft);
  const [type, setType] = useState(initialType);

  const handleUpdate = () => {
    if (!content || !top || !left || type === null) {
      message.error("Content, position and style are required.");
      return;
    }

    if (
      Number.isNaN(Number(top)) ||
      Number.isNaN(Number(left)) ||
      Number(top) > 100 ||
      Number(top) < 0 ||
      Number(left) > 100 ||
      Number(left) < 0
    ) {
      message.error("Top and left must be numbers between 0 and 100.");
      return;
    }

    onUpdate({
      id,
      content,
      top,
      left,
      type,
    });
    message.success("Fixed text updated.");
  };

  return (
    <div className="flex flex-col space-y-1 rounded border-y py-2">
      <Input
        className="flex-grow"
        addonBefore="Content"
        value={content}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setContent(event.target.value)}
      />
      <div className="flex items-center space-x-1">
        <Input
          className="flex-grow"
          addonBefore="Top"
          value={top}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTop(event.target.value)}
        />
        <Input
          className="flex-grow"
          addonBefore="Left"
          value={left}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setLeft(event.target.value)}
        />
      </div>
      <Select value={type} onChange={(value) => setType(value as EFixedTextType)}>
        <Select.Option value={EFixedTextType.PLAIN}>Plain</Select.Option>
        <Select.Option value={EFixedTextType.ORANGE}>Orange</Select.Option>
        <Select.Option value={EFixedTextType.SANTACLAUS}>Santa Claus</Select.Option>
        <Select.Option value={EFixedTextType.SANTAPLANE}>Santa Plane</Select.Option>
      </Select>
      <div className="flex items-center justify-end space-x-1">
        <Button size="small" onClick={handleUpdate}>
          Update
        </Button>
        <Button size="small" danger onClick={() => onDelete(id)}>
          Delete
        </Button>
      </div>
    </div>
  );
};

export function resolveImageFixedText(
  photoset?: IPhotosetItem | null,
  fallbackFixedText: IFixedTextItem[] = []
) {
  if (!photoset) {
    return fallbackFixedText;
  }

  if (photoset.fixedText !== undefined) {
    return photoset.fixedText as IFixedTextItem[];
  }

  return fallbackFixedText;
}

export function ShowFixedText({ fixedText }: { fixedText: IFixedTextItem[] }) {
  return (
    <>
      {fixedText.map((item) => {
        switch (item.type) {
          case EFixedTextType.ORANGE:
            return orangeText(item);
          case EFixedTextType.SANTACLAUS:
            return santaclausText(item);
          case EFixedTextType.SANTAPLANE:
            return santaplaneText(item);
          default:
            return plainText(item);
        }
      })}
    </>
  );
}

const plainText = (item: IFixedTextItem) => (
  <span
    className="pointer-events-none fixed-text_plain absolute text-lg md:text-xl"
    key={item.id}
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
);

const orangeText = (item: IFixedTextItem) => (
  <span
    className="pointer-events-none absolute bg-orange-400 px-2 py-1 text-lg text-white md:text-xl"
    key={item.id}
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
);

const santaclausText = (item: IFixedTextItem) => (
  <span
    className="pointer-events-none fixed-text_santaclaus absolute text-lg md:text-xl"
    key={item.id}
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
);

const santaplaneText = (item: IFixedTextItem) => (
  <span
    className="pointer-events-none fixed-text_santaplane absolute text-lg md:text-xl"
    key={item.id}
    style={{
      top: `${item.top}%`,
      left: `${item.left}%`,
    }}
  >
    {item.content}
  </span>
);
