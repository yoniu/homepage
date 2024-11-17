"use client";

import Upload, { IFileItem } from "@/src/components/editor/Upload";
import EditorMusic from "@/src/components/editor/music";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

export interface IPhotosetItem {
  id: number;
  url: string;
  type: string;
  name: string;
}

export default function TextEditorSidebar() {

  const { state, dispatch } = useEditorStateContext();

  const handleClickUploadFileItem = (item: IFileItem<any>) => {
    const prevAttributes = state.attributes ?? null;
    const prevPhotosets = (prevAttributes?.photosets ?? []) as IPhotosetItem[];
    const photo: IPhotosetItem = {
      id: item.id,
      url: item.url,
      type: item.type,
      name: item.filename,
    }
    const photosets: IPhotosetItem[] = [...prevPhotosets];
    if (photosets.find(photo => photo.id === item.id)) return;
    photosets.push(photo);
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        photosets
      }
    }});
  }

  return (
    <>
      <Upload onClickItem={handleClickUploadFileItem} />
      <EditorMusic />
    </>
  )
}
