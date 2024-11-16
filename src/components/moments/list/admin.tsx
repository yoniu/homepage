'use client';

import { useEffect, useState } from "react"
import { App, Button, Popconfirm } from "antd"

import api from "@/src/utils/api";

import { TResponseError } from "@/src/utils/axiosInstance"

import dayFormat from "@/src/utils/dayFormat"
import Link from "next/link";

export default function AdminMomentList() {
  
  const { message: messageApi } = App.useApp()

  const pageSize = 1;

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [hasNextPage, setHasNextPage] = useState(false)
  const [items, setItems] = useState<IMomentItem<any>[]>([])

  // 进入页面获取列表
  useEffect(() => {
    getMomentList()
  }, [])

  // 监听 page 改变获取新列表
  useEffect(() => {
    getMomentList()
  }, [page])

  // 点击加载更多
  const handlePageChange = () => {
    if (!hasNextPage) return
    setPage(page + 1)
  }

  // 点击删除确认
  const handleDelete = (id: number) => {
    if (loading) return
    setLoading(true)
    deleteMoment(id).then(() => {
      messageApi.success('删除成功')
      setPage(1)
    }).catch(err => {
      const { message } = err as TResponseError
      if (Array.isArray(message)) {
        message.map((msg) => messageApi.error(msg))
      } else {
        messageApi.error(message)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  // 获取动态列表
  const getMomentList = () => {
    setLoading(true)
    getList(page, pageSize).then(res => {
      setHasNextPage(res.data.hasNextPage)
      // 如果当前分页大于 1 则推入栈，否则直接赋值
      if (page > 1) {
        setItems([...items, ...res.data.moments])
      } else {
        setItems(res.data.moments)
      }
    }).catch(err => {
      const { message } = err as TResponseError
      if (Array.isArray(message)) {
        message.map((msg) => messageApi.error(msg))
      } else {
        messageApi.error(message)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  /**
   * Moment Item
   * @param item 
   * @returns 
   */
  const MomentItem = (item: IMomentItem<any>) => {

    const { id, title, content, create_time, update_time, attributes } = item

    let type = 'text'

    if (attributes && Object.keys(attributes).includes('type')) {
      type = attributes.type
    }

    return (
      <div className="w-full py-2 border-b border-gray-200" key={id}>
        <div className="flex space-x-2">
          <div className="text font-bold">{ title  ?? '无标题' }</div>
        </div>
        <div className="text text-gray-500 text-wrap">
          { content ? content.slice(0, 50) : '无内容' }
        </div>
        <div className="flex justify-between space-x-2 w-full">
          <div className="text-gray-400">#{ type }</div>
          <div className="flex space-x-2">
            <div className="text-gray-400">{dayFormat(create_time)}</div>
            <div className="text-gray-400">最后修改：{dayFormat(update_time)}</div>
            <Link
              href={`/editor`}
              className="text-blue-500 hover:underline"
            >
              编辑
            </Link>
            <Popconfirm
              placement="bottomRight"
              title="Delete Moment"
              description="Are you sure to delete this Moment?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(id)}
            >
              <button className="text-red-500 hover:underline">
                删除
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute space-y-3 top-0 left-0 w-full h-full overflow-y-auto">
      <div className="text-lg font-bold">Moment List</div>
      <div className="flex flex-col space-y-2">
        {
          items && items.map(item => MomentItem(item))
        }
      </div>
      <div className="flex items-center justify-center">
        <Button onClick={handlePageChange} disabled={!hasNextPage} loading={loading}>
          { hasNextPage ? "Load More" : "No More" }
        </Button>
      </div>
    </div>
  )
}

function getList(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/all', { page, pageSize })
}

function deleteMoment(id: number) {
  return api.del('/moment/' + id)
}
