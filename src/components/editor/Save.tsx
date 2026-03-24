import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import { updateMoment } from "@/src/features/moment/api";
import { normalizeApiError } from "@/src/shared/api/error";
import { SaveOutlined } from "@ant-design/icons";
import { App, Button } from "antd";
import { useState } from "react"; 

export default function Save() {

  const { state } = useEditorStateContext()
  const { message } = App.useApp()

  const [ loading, setLoading ] = useState(false)

  const handleSave = () => {
    if (loading) return

    const { id, title, content, status, attributes } = state
    if (!id) {
      message.error('未找到可保存的 Moment')
      return
    }

    setLoading(true)
    updateMoment(id, {
      id, title, content, status, attributes
    }).then(() => {
      message.success('保存成功')
    })
    .catch((error) => {
      normalizeApiError(message, error)
    })
    .finally(() => {
      setLoading(false)
    })
  }

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
  )
}
