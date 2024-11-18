"use client";

import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import { Col, Row } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export default function EditorPhotosets() {

  const { state, dispatch } = useEditorStateContext();

  const handleDelete = (id: number) => {
    const prevAttributes = state.attributes ?? null;
    const prevPhotosets = (prevAttributes?.photosets ?? []) as IPhotosetItem[];
    const index = prevPhotosets.findIndex((item) => item.id === id);
    if (index !== -1) {
      prevPhotosets.splice(index, 1);
    }
    dispatch({ type: 'UPDATE', states: {
      attributes: {
        ...prevAttributes,
        photosets: [...prevPhotosets]
      }
    }});
  }

  const List = () => (
    <Row className="mx-0" gutter={[6, 6]}>
      {
        (state.attributes?.photosets as IPhotosetItem[]).map(item => (
          <Col className="space-y-1" key={item.id} span={8}>
            <div
              className="group/photosets relative aspect-square border border-gray-200 rounded overflow-hidden cursor-pointer"
              onClick={() => handleDelete(item.id)}
            >
              <img src={item.url} alt={item.name} className="absolute w-full h-full object-cover" />
              <div className="absolute flex items-center justify-center bottom-0 left-0 w-full h-full text-xl bg-gray-900 bg-opacity-50 text-white opacity-0 group-hover/photosets:opacity-100 transition-opacity">
                <DeleteOutlined />
              </div>
            </div>
          </Col>
        ))
      }
    </Row>
  )

  return (
    <>
      {
        (state.attributes && state.attributes?.photosets) && <List />
      }
    </>
  )
}
