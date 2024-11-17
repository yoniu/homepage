import { cn } from "@/lib/utils";
import { CaretRightOutlined } from "@ant-design/icons";
import { useState } from "react";

interface IProps {
  className?: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SidebarCollapse({ className, title, children, defaultOpen = false }: IProps) {
  const [ open, setOpen ] = useState(defaultOpen);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-gray-500 cursor-pointer" onClick={() => setOpen(!open)}>
        <h4 className="">{ title }</h4>
        <CaretRightOutlined className={'transition-all' + (open ? ' rotate-90' : '')} />
      </div>
      <div className={ cn('transition-all overflow-hidden' + (open ? ' max-h-[auto] opacity-100' : ' max-h-0 opacity-0'), className) }>
        { children }
      </div>
    </div>
  )
}
