import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { Select } from 'antd';

export default function SelectVisible() {

  const { state, dispatch } = useEditorStateContext();

  const options: Array<{value: EMomentStatus, label: string}> = [
    { value: 0, label: '草稿' },
    { value: 1, label: '公开' },
    { value: 2, label: '私密' },
  ];

  const handleChange = (status: EMomentStatus) => {
    dispatch({ type: 'UPDATE', states: {
      status
    }});
  }

  return (
    <div className="w-full space-y-1">
      <h4 className="text-gray-500">选择可见范围</h4>
      <Select
        className="w-full"
        value={state.status}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
