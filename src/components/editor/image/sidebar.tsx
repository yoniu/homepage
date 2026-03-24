import Upload, { IFileItem } from "@/src/components/editor/Upload";
import EditorMusic from "@/src/components/editor/music";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import EditorPlainContent from "@/src/components/editor/plainContent";
import EditorFixedText from "@/src/components/editor/fixedText";

export default function ImageEditorSidebar() {
  const { state, dispatch } = useEditorStateContext();

  const handleClickUploadFileItem = (item: IFileItem) => {
    const prevAttributes = state.attributes ?? null;
    const prevPhotosets = (prevAttributes?.photosets ?? []) as IPhotosetItem[];
    const photo: IPhotosetItem = {
      id: item.id,
      url: item.url,
      type: item.type,
      name: item.filename,
    };
    const photosets: IPhotosetItem[] = [...prevPhotosets];
    const index = photosets.findIndex((photoItem) => photoItem.id === item.id);
    let selectedPhotosetId = state.selectedPhotosetId;

    if (index > -1) {
      photosets.splice(index, 1);
      if (selectedPhotosetId === item.id) {
        selectedPhotosetId = photosets[Math.min(index, photosets.length - 1)]?.id;
      }
    } else {
      photosets.push(photo);
      selectedPhotosetId = item.id;
    }

    dispatch({
      type: "UPDATE",
      states: {
        attributes: {
          ...prevAttributes,
          photosets,
        },
        selectedPhotosetId,
      },
    });
  };

  return (
    <>
      <EditorPlainContent />
      <Upload multiple title="上传图片" onClickItem={handleClickUploadFileItem} />
      <EditorMusic />
      <EditorFixedText scope="photoset" />
    </>
  );
}
