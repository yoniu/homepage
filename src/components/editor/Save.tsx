import { useState } from "react";
import { App, Button } from "antd";
import { SaveOutlined } from "@ant-design/icons";

import { updateMoment } from "@/src/features/moment/api";
import { markMomentFeedStale } from "@/src/features/moment/utils/feedRefresh";
import { normalizeApiError } from "@/src/shared/api/error";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";

export default function Save() {
  const { state } = useEditorStateContext();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (loading) return;

    const { id, title, content, status, attributes } = state;
    if (!id) {
      message.error('未找到可保存的 Moment');
      return;
    }

    setLoading(true);
    updateMoment(id, {
      id, title, content, status, attributes
    }).then(() => {
      markMomentFeedStale();
      message.success('保存成功');
    })
    .catch((error) => {
      normalizeApiError(message, error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex justify-end">
      <Button
        type="primary"
        variant="solid"
        loading={loading}
        onClick={handleSave}
        icon={<SaveOutlined />}
      >保存</Button>
    </div>
  );
}
