import { useStateContext as useEditorStateContext } from '@/src/stores/editor';
import { Select } from 'antd';
import { EMomentStatus, type EMomentStatus as TMomentStatus } from '@/src/types/moment';

export default function SelectVisible() {
  const { state, dispatch } = useEditorStateContext();

  const options: Array<{ value: TMomentStatus; label: string }> = [
    { value: EMomentStatus.Draft, label: '鑽夌' },
    { value: EMomentStatus.Published, label: '鍏紑' },
    { value: EMomentStatus.Self, label: '绉佸瘑' },
  ];

  const handleChange = (status: TMomentStatus) => {
    dispatch({
      type: 'UPDATE',
      states: {
        status,
      },
    });
  };

  return (
    <div className="w-full space-y-1">
      <h4 className="text-gray-500">閫夋嫨鍙鑼冨洿</h4>
      <Select
        className="w-full"
        value={state.status}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
}
