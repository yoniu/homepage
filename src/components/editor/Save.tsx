import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import api from "@/src/utils/api";
import { TResponseError } from "@/src/utils/axiosInstance";
import { App, Button } from "antd";
import { useState } from "react";

export default function Save() {

  const { state } = useEditorStateContext()
  const { message } = App.useApp()

  const [ loading, setLoading ] = useState(false)

  const handleSave = () => {
    if (loading) return
    const { id, title, content, status, attributes } = state
    setLoading(true)
    update({
      id, title, content, status, attributes
    }).then(() => {
      message.success('保存成功')
    })
    .catch((error) => {
      const err = error as TResponseError
      if (Array.isArray(err.message)) {
        err.message.map((msg) => message.error(msg))
      } else {
        message.error(err.message)
      }
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
      >保存</Button>
    </div>
  )
}

function update(moment: Partial<IMomentItem<any>>) {
  return api.patch(`/moment/${moment.id}`, moment)
}
