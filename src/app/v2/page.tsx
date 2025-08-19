"use client";

import Menu from "@/src/components/menu/Index";
import Center from "@/src/components/moments/v2/center/Index";

export default function Page() {

  return (
    <>
      <div className="absolute h-full w-full flex items-stretch overflow-hidden">
        <Menu />
        <Center />
      </div>
    </>
  )
}
