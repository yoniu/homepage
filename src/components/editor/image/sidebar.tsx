import Upload, { IFileItem } from "@/src/components/editor/Upload";
import EditorMusic from "@/src/components/editor/music";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import EditorPlainContent from "../plainContent";

export default function ImageEditorSidebar() {

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
    const index = photosets.findIndex(photo => photo.id === item.id)
    if (index > -1) {
      photosets.splice(index, 1);
    } else {
      photosets.push(photo);
    }
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        photosets
      }
    }});
  }

  return (
    <>
      <EditorPlainContent />
      <Upload title="上传图片" onClickItem={handleClickUploadFileItem} />
      <EditorMusic />
    </>
  )
}
