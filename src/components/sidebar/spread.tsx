import { LeftOutlined, RightOutlined } from "@ant-design/icons"

interface IProps {
  show: boolean
  toggleShow: () => void
}

export default function SidebarSpread({show, toggleShow}: IProps) {
  return (
    <div className="absolute flex justify-center items-center w-8 h-12 bg-white top-1/2 translate-y-1/2 -left-8 sm:none sm:hidden border rounded-l-full border-r-0" onClick={toggleShow}>
      { !show && <LeftOutlined /> }
      { show && <RightOutlined /> }
    </div>
  )
}
