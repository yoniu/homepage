import { App, Button, Divider, Input, Select, Spin } from "antd"
import React, { useState } from "react"

export type TMetingResponse = {
  name: string,
  artist: string,
  url: string,
  pic: string,
  lrc: string,
}

interface IProps {
  onSubmit: (meting: TMetingResponse) => void
}

export default function Meting({ onSubmit }: IProps) {

  const { message } = App.useApp()

  const [ api, setApi ] = useState('https://api.injahow.cn/meting/')

  const [ id, setId ] = useState('')

  const [ server, setServer ] = useState('tencent')

  const [ meting, setMeting ] = useState<TMetingResponse | null>(null)

  const [ loading, setLoading ] = useState(false)

  const options = [
    { label: "QQ 音乐", value: 'tencent' },
    { label: "网易", value: 'netease' },
  ]

  const handleChangeApi = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApi(e.target.value)
  }
  const handleChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
  }
  const handleChangeServer = (value: string) => {
    setServer(value)
  }

  const handleSearch = () => {
    setLoading(true)
    fetch(`${api}?type=song&id=${id}&server=${server}`)
      .then(res => res.json())
      .then(res => {
        if (Array.isArray(res)) {
          setMeting(res[0])
        } else {
          throw new Error(res.error)
        }
      })
      .catch(err => {
        message.error(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Spin spinning={loading}>
      <div className="space-y-2">
        <Input value={api} placeholder="API 连接" onChange={handleChangeApi} />
        <Select value={server} options={options} onChange={handleChangeServer}></Select>
        <Input value={id} placeholder="音乐 ID" onChange={handleChangeId} />
        <div className="flex w-full items-center justify-end space-x-3">
          <Button onClick={handleSearch}>查询</Button>
          <Button type="primary" disabled={meting === null} onClick={() => onSubmit(meting as TMetingResponse)}>插入</Button>
        </div>
      </div>
      { meting && <Demo {...meting} /> }
    </Spin>
  )

}

const Demo = (meting: TMetingResponse) => (
  <>
    <Divider />
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <img className="rounded-lg w-12 h-12" src={meting.pic} alt={meting.name} />
        <div className="flex-1 flex flex-col">
          <strong>{meting.name}</strong>
          <i>{meting.artist}</i>
        </div>
      </div>
      <audio src={meting.url} controls></audio>
    </div>
  </>
)
