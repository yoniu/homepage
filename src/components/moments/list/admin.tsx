'use client';

import { Button, Popconfirm } from "antd"
import Link from "next/link";

import { useAdminMomentList } from "@/src/features/moment/hooks/useAdminMomentList";

import dayFormat from "@/src/utils/dayFormat"

export default function AdminMomentList() {
  const { hasNextPage, items, loadMore, loading, remove } = useAdminMomentList()

  /**
   * Moment Item
   * @param item 
   * @returns 
   */
  const MomentItem = (item: typeof items[number]) => {

    const { id, title, content, create_time, update_time, attributes } = item

    let type = 'text'

    if (attributes && Object.keys(attributes).includes('type')) {
      type = String(attributes.type)
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
              onConfirm={() => remove(id)}
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
        <Button onClick={loadMore} disabled={!hasNextPage} loading={loading}>
          { hasNextPage ? "Load More" : "No More" }
        </Button>
      </div>
    </div>
  )
}
