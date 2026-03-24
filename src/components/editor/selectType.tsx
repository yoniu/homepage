import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { Select } from 'antd';
import { EMomentType, type EMomentType as TMomentType } from '@/src/types/moment';

export default function SelectType() {

  const { state, dispatch } = useEditorStateContext();

  const options = [
    { label: '文章', value: EMomentType.Text },
    { label: '图片', value: EMomentType.Image },
    { label: '视频', value: EMomentType.Video },
    { label: 'livephoto (未完成)', value: EMomentType.Live },
    { label: '音乐', value: EMomentType.Music },
  ];

  const handleChange = (type: TMomentType) => {
    const prevAttributes = state.attributes ?? null;
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        type
      }
    }});
  }

  return (
    <div className="w-full space-y-1">
      <h4 className="text-gray-500">选择展示类型</h4>
      <Select
        className="w-full"
        defaultValue={EMomentType.Text}
        value={state.attributes?.type}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
