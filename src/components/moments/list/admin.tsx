'use client';

import { useCallback, useEffect, useState } from "react"
import { App, Button, Popconfirm } from "antd"
import Link from "next/link";

import { deleteMoment, getAllMoments } from "@/src/features/moment/api";
import { normalizeApiError } from "@/src/shared/api/error";

import dayFormat from "@/src/utils/dayFormat"

export default function AdminMomentList() {
  
  const { message: messageApi } = App.useApp()

  const pageSize = 5;

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(1)

  const [hasNextPage, setHasNextPage] = useState(false)
  const [items, setItems] = useState<IMomentItem<any>[]>([])

  const getMomentList = useCallback(async (targetPage: number, reset = false) => {
    setLoading(true)

    try {
      const response = await getAllMoments(targetPage, pageSize)
      setHasNextPage(response.data.hasNextPage)
      setItems((prevItems) => reset ? response.data.moments : [...prevItems, ...response.data.moments])
    } catch (error) {
      normalizeApiError(messageApi, error)
    } finally {
      setLoading(false)
    }
  }, [messageApi, pageSize])

  // 进入页面获取列表
  useEffect(() => {
    void getMomentList(1, true)
  }, [getMomentList])

  // 点击加载更多
  const handlePageChange = useCallback(() => {
    if (!hasNextPage || loading) return

    const nextPage = page + 1
    setPage(nextPage)
    void getMomentList(nextPage)
  }, [getMomentList, hasNextPage, loading, page])

  // 点击删除确认
  const handleDelete = useCallback((id: number) => {
    if (loading) return

    setLoading(true)
    deleteMoment(id).then(() => {
      messageApi.success('删除成功')
      setPage(1)
      return getMomentList(1, true)
    }).catch((error) => {
      normalizeApiError(messageApi, error)
    }).finally(() => {
      setLoading(false)
    })
  }, [getMomentList, loading, messageApi])

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
              href={`/editor/?id=${id}`}
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
