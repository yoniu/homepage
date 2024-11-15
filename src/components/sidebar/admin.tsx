'use client';

import { useState } from "react";

import { StateProvider as UserStateProvider } from '@/src/stores/user';

import { cn } from "@/lib/utils"

import useIcon from "@/src/hooks/icon";
import AdminNavigator from "@/src/components/navigator/admin";
import OtherFooter from "@/src/components/footer/other";

export default function AdminSidebar() {

  const IconFont = useIcon()

  const [show, setShow] = useState(false)

  const isShow = () => {
    return show ? 'translate-x-0' : 'translate-x-full'
  }

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <UserStateProvider>
      <div className={cn("fixed flex flex-col md:static bg-white w-56 h-screen md:h-full md:w-full z-10 md:z-0 top-0 right-0 md:right-auto md:top-auto p-4 md:p-0 shadow-lg md:shadow-none transition-all", isShow(), 'md:translate-x-0')}>
        <div className="absolute flex justify-center items-center w-12 h-12 bg-white rounded-full top-1/2 translate-y-1/2 -left-6 sm:none sm:hidden" onClick={toggleShow}>
          { !show && <IconFont className="mr-4" type="icon-xiangzuo1" /> }
          { show && <IconFont className="mr-4" type="icon-xiangyou1" /> }
        </div>
        <AdminNavigator />
        <OtherFooter />
      </div>
    </UserStateProvider>
  )
}
