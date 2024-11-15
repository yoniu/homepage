'use client';

import { useEffect, useState } from "react"
import { message } from "antd"

import api from "@/src/utils/api";

import { TResponseError } from "@/src/utils/axiosInstance"
import { useRouter } from "next/navigation";

import dayFormat from "@/src/utils/dayFormat";

export default function AdminMomentList() {

  const [messageApi, contextHolder] = message.useMessage()
  const router = useRouter()

  const pageSize = 1;

  const [page, setPage] = useState(1)

  const [hasNextPage, setHasNextPage] = useState(false)
  const [items, setItems] = useState<IMomentItem<any>[]>([])

  useEffect(() => {
    getMomentList()
  }, [])

  useEffect(() => {
    getMomentList()
  }, [page])

  const handlePageChange = () => {
    if (!hasNextPage) return
    setPage(page + 1)
  }

  const getMomentList = () => {
    console.log(page)
    getList(page, pageSize).then(res => {
      setHasNextPage(res.data.hasNextPage)
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
      router.replace('/')
    })
  }

  return (
    <div className="space-y-3">
      {contextHolder}
      <div className="text-lg font-bold">Moment List</div>
      <div className="flex flex-col">
        {
          items && items.map(item => (
            <div key={item.id}>
              { item.id } - { item.author } - 
              { dayFormat(new Date(item.create_time).getTime()) }
            </div>
          ))
        }
      </div>
      <div className="flex items-center justify-center">
        <button
          className={
            "rounded px-3 py-1" +
            (hasNextPage ? " bg-blue-500 text-white" : " bg-gray-200")
          }
          onClick={handlePageChange}
        >
          {
            hasNextPage ? "Load More" : "No More"
          }
        </button>
      </div>
    </div>
  )
}

function getList(page: number, pageSize: number) {
  return api.get<IGetMomentListResponse>('/moment/all', { page, pageSize })
}
