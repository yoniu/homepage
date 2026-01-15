import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { Select } from 'antd';

export default function SelectType() {

  const { state, dispatch } = useEditorStateContext();

  const options = [
    { label: '文章', value: 'text' },
    { label: '图片', value: 'image' },
    { label: '视频', value: 'video' },
    { label: 'livephoto (未完成)', value: 'live' },
    { label: '音乐', value: 'music' },
  ];

  const handleChange = (type: string) => {
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
        defaultValue="text"
        value={state.attributes?.type}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
