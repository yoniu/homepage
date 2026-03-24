"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Popconfirm, Row, Spin, Upload as UploadAntd, UploadProps } from "antd";
import { useSearchParams } from "next/navigation";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import React from "react";

import { deleteFile, getMomentFiles, uploadFile, type EditorFileItem } from "@/src/features/editor/api";
import { normalizeApiError } from "@/src/shared/api/error";

import SidebarCollapse from "./collapse"; 

export type IFileItem<T = Record<string, never>> = EditorFileItem<T>;

export default function Upload(
  {
    title = '上传文件',
    type = 'image/*',
    fileItemDecorate,
    onClickItem,
  }:
  {
    title?: string,
    type?: string, // "image/jpeg"
    fileItemDecorate?: (item: IFileItem) => React.JSX.Element
    onClickItem?: (item: IFileItem) => void,
  }
) {

  const query = useSearchParams();
  const { message } = App.useApp();
  const { state } = useEditorStateContext();

  const [ fileList, setFileList ] = useState<IFileItem[]>([]);

  const [ loading, setLoading ] = useState(false);
  type CustomUploadRequest = NonNullable<UploadProps['customRequest']>;

  const handleGetFileList = useCallback(async (id: number) => {
    setLoading(true);

    try {
      const response = await getMomentFiles(id);
      if (response.data) {
        setFileList(response.data);
      }
    } catch (error) {
      normalizeApiError(message, error);
    } finally {
      setLoading(false);
    }
  }, [message])

  const handleUpload: CustomUploadRequest = useCallback((options) =>  {
    const moment = query.get('id');
    if (!moment) return;

    const { file, onProgress, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('moment', moment);
  
    setLoading(true);
    uploadFile(formData, {
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / (event.total ??  1));
        if (onProgress) onProgress({ percent });
      },
    })
    .then(response => {
      if (onSuccess) onSuccess(response.data);
      message.success('上传成功');
    })
    .catch(error => {
      if (onError) onError(error);
      normalizeApiError(message, error);
    }).finally(() => {
      setLoading(false);
      if (state.id) {
        void handleGetFileList(state.id);
      }
    });
  }, [handleGetFileList, message, query, state.id])

  const handleDeleteFile = useCallback((id: number) => {
    setLoading(true);
    deleteFile(id).then(() => {
      message.success('删除成功');
      if (state.id) {
        return handleGetFileList(state.id);
      }
    }).catch((error) => {
      normalizeApiError(message, error);
    }).finally(() => {
      setLoading(false);
    });
  }, [handleGetFileList, message, state.id])

  useEffect(() => {
    if (state.id) {
      void handleGetFileList(state.id);
    }
  }, [handleGetFileList, state.id])

  const uploadProps: UploadProps = useMemo(() => ({
    name: 'file',
    type: 'select',
    accept: type,
    customRequest: handleUpload,
    showUploadList: false,
  }), [type, handleUpload]);

  const Container = () => (
    <Spin spinning={loading}>
      <FileList list={fileList} />
      <UploadAntd {...uploadProps}>
        <Button className="mt-2" icon={<UploadOutlined />} size="small">Upload</Button>
      </UploadAntd>
    </Spin>
  )

  const FileList = memo((
    {
      list = fileList
    }:
    {
      list?: IFileItem[]
    }
  ) => {
    if (!list) return <></>;

    const handleClickItem = (item: IFileItem) => {
      if (onClickItem) onClickItem(item);
    }

    return (
      <div className="space-y-1">
        {
          list.map(item => (
            <div
              className="flex items-center justify-between space-x-2"
              key={item.id}
            >
              <div
                className="flex-1 truncate"
                title={item.filename}
                onClick={() => handleClickItem(item)}
              >
                { item.filename }
              </div>
              <Popconfirm
                title="删除图片"
                description="是否删除该图片？"
                placement="bottom"
                onConfirm={ () => handleDeleteFile(item.id)}
                okText="确认"
                cancelText="取消"
              >
                <button className="text-red-600">
                  <DeleteOutlined />
                </button>
              </Popconfirm>
            </div>
          ))
        }
      </div>
    )
  })
  FileList.displayName = 'FileList'

  return (
    <SidebarCollapse
      title={title}
      defaultOpen={true}
    >
      <Spin spinning={loading}>
        {
          type.includes('image') ? (
            <Row gutter={[6, 6]}>
              {
                fileList.filter(item => item.format.includes('image')).map(item => (
                  <Col className="space-y-1" span={8} key={item.id}>
                    <div
                      className="relative aspect-square border border-gray-200 rounded overflow-hidden cursor-pointer"
                      onClick={() => onClickItem?.(item)}
                    >
                      <img src={item.url} alt={item.filename} className="absolute w-full h-full object-cover" />
                      { fileItemDecorate && fileItemDecorate(item) }
                    </div>
                    <div className="text-right">
                      <Popconfirm
                        title="删除图片"
                        description="是否删除该图片？"
                        placement="bottom"
                        onConfirm={() => handleDeleteFile(item.id)}
                        okText="确认"
                        cancelText="取消"
                      >
                        <button className="text-red-600">
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                    </div>
                  </Col>
                ))
              }
            </Row>
          ) : (
            <Container />
          )
        }
        { type.includes('image') && (
          <UploadAntd {...uploadProps}>
            <Button className="mt-2" icon={<UploadOutlined />} size="small">Upload</Button>
          </UploadAntd>
        )}
      </Spin>
    </SidebarCollapse>
  )
}
