"use client";

import { memo, useEffect, useMemo, useState } from "react";

import api from "@/src/utils/api";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Popconfirm, Row, Spin, Upload as UploadAntd, UploadProps } from "antd";
import { AxiosRequestConfig } from "axios";
import { useSearchParams } from "next/navigation";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import React from "react";
import SidebarCollapse from "./collapse"; 

export enum EFileStatus {
  deleted,
  normal,
  explicit,
}

export interface IFileItem<T> {
    id: number,
    filename: string,
    url: string,
    size: number,
    format: string, // "image/jpeg"
    type: string, // "image/jpeg"
    moment: number,
    author: number,
    create_time: Date,
    update_time: Date,
    status: EFileStatus,
    meta: T
}

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
    fileItemDecorate?: (item: IFileItem<any>) => React.JSX.Element
    onClickItem?: (item: IFileItem<any>) => void,
  }
) {

  const query = useSearchParams();
  const { message } = App.useApp();
  const { state } = useEditorStateContext();

  const [ fileList, setFileList ] = useState<IFileItem<any>[]>([]);

  const [ loading, setLoading ] = useState(false);

  const handleUpload: UploadProps['customRequest'] = (options) =>  {
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
      message.error('上传失败');
    }).finally(() => {
      setLoading(false);
      if (state.id) handleGetFileList(state.id);
    });
  }

  const handleGetFileList = (id: number) => {
    setLoading(true);
    getList(id).then(res => {
      const list = res.data
      if (list) {
        setFileList(list)
      }
    }).catch(() => {
      message.error('获取图片列表失败');
    }).finally(() => {
      setLoading(false);
    });
  }

  const handleDeleteFile = (id: number) => {
    setLoading(true);
    deleteFile(id).then(() => {
      message.success('删除成功');
      if (state.id) handleGetFileList(state.id);
    }).catch(() => {
      message.error('删除失败');
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (state.id) {
      handleGetFileList(state.id);
    }
  }, [state.id])

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

  const ImageList = memo((
    {
      list = fileList
    }:
    {
      list?: IFileItem<any>[]
    }
  ) => {
    if (!list) return <></>;

    const handleClickItem = (item: IFileItem<any>) => {
      if (onClickItem) onClickItem(item);
    }

    return (
      <Row gutter={[6, 6]}>
        {
          list.filter(item => item.format.includes('image')).map(item => (
            <Col className="space-y-1" span={8} key={item.id}>
              <div
                className="relative aspect-square border border-gray-200 rounded overflow-hidden cursor-pointer"
                onClick={() => handleClickItem(item)}
              >
                <img src={item.url} alt={item.filename} className="absolute w-full h-full object-cover" />
                { fileItemDecorate && fileItemDecorate(item)  }
              </div>
              <div className="text-right">
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
            </Col>
          ))
        }
      </Row>
    )
  })
  ImageList.displayName = 'FileList'

  const FileList = memo((
    {
      list = fileList
    }:
    {
      list?: IFileItem<any>[]
    }
  ) => {
    if (!list) return <></>;

    const handleClickItem = (item: IFileItem<any>) => {
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
      <Container />
    </SidebarCollapse>
  )
}

function uploadFile(data: object, options?: AxiosRequestConfig<any>) {
  return api.put('/file/upload', data, options)
}

function deleteFile(id: number) {
  return api.del(`/file/remove/${id}`)
}

function getList(id: number) {
  return api.get<IFileItem<any>[]>(`/file/moment/${id}`)
}
