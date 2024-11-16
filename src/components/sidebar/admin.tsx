'use client';

import { useState } from "react";

import { cn } from "@/lib/utils"

import AdminNavigator from "@/src/components/navigator/admin";
import OtherFooter from "@/src/components/footer/other";
import SidebarSpread from "./spread";

export default function AdminSidebar() {

  const [show, setShow] = useState(false)

  const isShow = () => {
    return show ? 'translate-x-0' : 'translate-x-full'
  }

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <div className={cn("fixed flex flex-col md:static bg-white w-56 h-screen md:h-full md:w-full z-10 md:z-0 top-0 right-0 md:right-auto md:top-auto p-4 md:p-0 shadow-lg md:shadow-none transition-all", isShow(), 'md:translate-x-0')}>
      <SidebarSpread show={show} toggleShow={toggleShow} />
      <AdminNavigator />
      <OtherFooter />
    </div>
  )
}
