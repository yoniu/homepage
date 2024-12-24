import Upload, { IFileItem } from "@/src/components/editor/Upload";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import EditorPlainContent from "@/src/components/editor/plainContent";
import EditorFixedText from "@/src/components/editor/fixedText";

export default function VideoEditorSidebar() {

  const { state, dispatch } = useEditorStateContext();

  const handleClickUploadFileItem = (item: IFileItem<any>) => {
    if (!item.type.includes('video')) return;
    const prevAttributes = state.attributes ?? null;
    const prevVideo = prevAttributes?.video as IVideoItem ?? {};
    prevVideo.url = item.url;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        video: prevVideo
      }
    }});
  }
  

  return (
    <>
      <EditorPlainContent />
      <Upload title="上传文件" type="*" onClickItem={handleClickUploadFileItem} />
      <EditorFixedText />
    </>
  )
}
