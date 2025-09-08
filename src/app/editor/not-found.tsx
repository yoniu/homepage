import { LeftOutlined } from '@ant-design/icons'
import { Button, Empty } from 'antd'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Empty
        description={
          <span>
            <span className="text-2xl">404</span>
            <br />
            Page Not Found
          </span>
        }
      >
        <Link href="/">
          <Button type="text" icon={<LeftOutlined />}>Back Home</Button>
        </Link>
      </Empty>
    </div>
  )
}
