"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";

import {
  CustomerServiceOutlined,
  DeleteOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { App, Button, Col, Popconfirm, Row, Spin, Upload as UploadAntd, UploadProps } from "antd";
import { useSearchParams } from "next/navigation";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import React from "react";

import { deleteFile, getMomentFiles, uploadFile, type EditorFileItem } from "@/src/features/editor/api";
import { normalizeApiError } from "@/src/shared/api/error";

import SidebarCollapse from "./collapse"; 

export type IFileItem<T = Record<string, never>> = EditorFileItem<T>;

const getFileMime = (item: IFileItem) => item.format || item.type || "";

const isImageFile = (item: IFileItem) => getFileMime(item).includes("image");

const isVideoFile = (item: IFileItem) => getFileMime(item).includes("video");

const isAudioFile = (item: IFileItem) => getFileMime(item).includes("audio");

const isPdfFile = (item: IFileItem) => getFileMime(item).includes("pdf");

const isTextFile = (item: IFileItem) => {
  const mime = getFileMime(item);
  return ["text", "json", "xml", "markdown"].some((keyword) => mime.includes(keyword));
};

const isArchiveFile = (item: IFileItem) => {
  const mime = getFileMime(item);
  return ["zip", "rar", "7z", "tar", "gzip"].some((keyword) => mime.includes(keyword));
};

const formatFileSize = (size: number) => {
  if (!size) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let nextSize = size;
  let unitIndex = 0;

  while (nextSize >= 1024 && unitIndex < units.length - 1) {
    nextSize /= 1024;
    unitIndex += 1;
  }

  const fixed = nextSize >= 10 || unitIndex === 0 ? 0 : 1;
  return `${nextSize.toFixed(fixed)} ${units[unitIndex]}`;
};

const getFileTypeIcon = (item: IFileItem) => {
  if (isVideoFile(item)) return <VideoCameraOutlined className="text-xl text-blue-500" />;
  if (isAudioFile(item)) return <CustomerServiceOutlined className="text-xl text-emerald-500" />;
  if (isPdfFile(item)) return <FilePdfOutlined className="text-xl text-rose-500" />;
  if (isTextFile(item)) return <FileTextOutlined className="text-xl text-amber-500" />;
  if (isArchiveFile(item)) return <FileZipOutlined className="text-xl text-violet-500" />;
  if (isImageFile(item)) return <FileImageOutlined className="text-xl text-sky-500" />;

  return <FileOutlined className="text-xl text-gray-500" />;
};

export default function Upload(
  {
    title = '上传文件',
    type = 'image/*',
    multiple = false,
    fileItemDecorate,
    onClickItem,
  }:
  {
    title?: string,
    type?: string, // "image/jpeg"
    multiple?: boolean,
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
    multiple,
    customRequest: handleUpload,
    showUploadList: false,
  }), [handleUpload, multiple, type]);

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
      <div className="space-y-2">
        {
          list.map(item => (
            <div
              className="flex items-center space-x-3 rounded-md border border-gray-200 p-2"
              key={item.id}
            >
              <div
                className="flex min-w-0 flex-1 cursor-pointer items-center space-x-3"
                title={item.filename}
                onClick={() => handleClickItem(item)}
              >
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                  {
                    isImageFile(item) ? (
                      <img src={item.url} alt={item.filename} className="absolute h-full w-full object-cover" />
                    ) : (
                      getFileTypeIcon(item)
                    )
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900">
                    { item.filename }
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    { getFileMime(item) || "unknown" } · { formatFileSize(item.size) }
                  </div>
                </div>
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
                fileList.filter(item => isImageFile(item)).map(item => (
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
