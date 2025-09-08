"use client";

import { Suspense } from "react";
import Menu from "@/src/components/menu/Index";
import Center from "@/src/components/moments/v2/center/Index";

export default function Page() {

  return (
    <>
      <div className="absolute h-full w-full flex items-stretch overflow-hidden">
        <Menu />
        <Suspense fallback={<div>加载中...</div>}>
          <Center />
        </Suspense>
      </div>
    </>
  )
}
