"use client";

import { useEffect, useState } from "react";

import api from "@/src/utils/api";
import { CaretRightOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Col, Row, Spin, Upload as UploadAntd, UploadProps } from "antd";
import { AxiosRequestConfig } from "axios";
import { useSearchParams } from "next/navigation";
import { useStateContext as useEditorStateContext } from "@/src/stores/editor";
import React from "react";

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

  const [ open, setOpen ] = useState(true);
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

  useEffect(() => {
    if (state.id) {
      handleGetFileList(state.id);
    }
  }, [state.id])

  const uploadProps: UploadProps = {
    name: 'file',
    type: 'select',
    accept: type,
    customRequest: handleUpload,
    showUploadList: false,
  }

  const Container = () => (
    <Spin spinning={loading}>
      <div className={ 'transition-all overflow-hidden' + (open ? ' max-h-[auto] opacity-100' : ' max-h-0 opacity-0') }>
        <FileList list={fileList} />
        <UploadAntd {...uploadProps}>
          <Button className="mt-2" icon={<UploadOutlined />} size="small">Upload</Button>
        </UploadAntd>
      </div>
    </Spin>
  )

  const FileList = (
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
            <Col span={8} key={item.id}>
              <div
                className="relative aspect-square border border-gray-200 rounded overflow-hidden"
                onClick={() => handleClickItem(item)}
              >
                <img src={item.url} alt={item.filename} className="absolute w-full h-full object-cover" />
                { fileItemDecorate && fileItemDecorate(item)  }
              </div>
            </Col>
          ))
        }
      </Row>
    )
  }

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-gray-500 cursor-pointer" onClick={() => setOpen(!open)}>
        <h4 className="">{ title }</h4>
        <CaretRightOutlined className={'transition-all' + (open ? ' rotate-90' : '')} />
      </div>
      <Container />
    </div>
  )
}

function uploadFile(data: object, options?: AxiosRequestConfig<any>) {
  return api.put('/file/upload', data, options)
}

function getList(id: number) {
  return api.get<IFileItem<any>[]>(`/file/moment/${id}`)
}
