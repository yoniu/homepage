"use client";

import MomentLoading from '@/src/components/moments/item/loading';

import Sidebar from "@/src/components/sidebar"

export default function Page() {

  return (
    <>
      <div id="main">
        <div className="flex items-center justify-center w-full h-full">
          <MomentLoading />
        </div>
      </div>
      <div id="sidebar">
        <Sidebar />
      </div>
    </>
  )
}
