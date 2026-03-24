import Upload, { IFileItem } from "@/src/components/editor/Upload";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import EditorPlainContent from "@/src/components/editor/plainContent";
import EditorFixedText from "@/src/components/editor/fixedText";
import { App } from "antd";

export default function VideoEditorSidebar() {

  const { state, dispatch } = useEditorStateContext();
  const { message } = App.useApp();

  const handleClickUploadFileItem = async (item: IFileItem) => {
    if (!item.type.includes('video')) {
      try {
        await navigator.clipboard.writeText(item.url);
        message.success('文件 URL 已复制到剪贴板');
      } catch {
        message.error('复制失败，请手动复制文件 URL');
      }
      return;
    }

    const prevAttributes = state.attributes ?? null;
    const prevVideo = prevAttributes?.video as Partial<IVideoItem> ?? {};
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        video: {
          ...prevVideo,
          url: item.url,
        }
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
