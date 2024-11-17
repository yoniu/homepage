"use client";

import {
  usePlateEditor,
  Plate,
} from '@udecode/plate-common/react';
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { MarkdownPlugin } from '@udecode/plate-markdown';

import { useStateContext as useEditorStateContext } from "@/src/stores/editor"
import { useEffect, useState } from 'react';
import { createPlateUI } from './lib/createPlateUI';
import { Editor, EditorContainer } from './lib/editorContainer';

export default function TextEditor() {

  const [initialized, setInitialized] = useState(false)
  const { state, dispatch } = useEditorStateContext() 
  const editor = usePlateEditor({
    value: state.content ? [{ children: [{ text: state.content }], type: 'p' }] : undefined,
    plugins: [
      MarkdownPlugin,
      BoldPlugin,
      ItalicPlugin,
      UnderlinePlugin,
    ],
    override: {
      components: createPlateUI(),
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE",
      states: {
        title: e.target.value
      }
    })
  }

  const handleContentChange = () => {
    dispatch({
      type: "UPDATE",
      states: {
        content: editor.api.markdown.serialize({
          ignoreParagraphNewline: true
        })
      }
    })
  }

  // 设置编辑器默认内容
  useEffect(() => {
    if (initialized) return
    if (state.content) {
      const content = editor.api.markdown.deserialize(state.content);
      editor.tf.setValue(content)
      setInitialized(true)
    }
  }, [state.content])

  return (
    <>
      <div className="absolute left-0 top-0 w-full h-full overflow-y-auto space-y-3">
        <input
          value={state.title ?? ''}
          className="w-full border-gray-300 rounded-md text-2xl font-bold outline-none"
          placeholder="Write your title..."
          onChange={handleTitleChange}
        ></input>
        <Plate editor={editor} onChange={handleContentChange}>
          <EditorContainer>
            <Editor placeholder="Type..." />
          </EditorContainer>
        </Plate>
      </div>
    </>
  )
}
