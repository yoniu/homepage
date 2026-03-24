"use client";

import { GlobalOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import navigator from "@/src/configs/navigator.json";
import MomentDisplayTypeToggle from "@/src/features/moment/components/MomentDisplayTypeToggle";
import useIcon from "@/src/hooks/icon";
import { useStateContext as useUserstateContext } from "@/src/stores/user";

const MenuLoginButton = dynamic(() => import("@/src/features/auth/components/MenuLoginButton"), {
  ssr: false,
});

type TNav = typeof navigator[0];

export default function List() {
  const pathname = usePathname();
  const IconFont = useIcon();

  const { state } = useUserstateContext();

  const className = (item: TNav) => {
    const url = item.url.includes("/") ? item.url : `/${item.url}`;

    if (pathname === url) {
      return "flex items-center bg-[#005DD9]/20 rounded-lg px-2 py-2 -mx-2 space-x-2 transition-all";
    }

    return "flex items-center hover:bg-gray-200 rounded-lg px-2 py-2 -mx-2 space-x-2 transition-all";
  };

  const textClassName = "text-xs lg:text-base";

  const linkItem = (item: TNav) => (
    <Fragment key={item.name}>
      <Link className={className(item)} href={item.url} title={item.description}>
        <IconFont type={`icon-${item.icon}`} />
        <span className={textClassName}>{item.name}</span>
      </Link>
    </Fragment>
  );

  const aItem = (item: TNav) => (
    <Fragment key={item.name}>
      <a className={className(item)} href={item.url} target="_blank" rel="noreferrer" title={item.description}>
        <IconFont type={`icon-${item.icon}`} />
        <span className={textClassName}>{item.name}</span>
      </a>
    </Fragment>
  );

  const Admin = () => (
    <Link className="flex items-center hover:bg-gray-200 rounded px-3 py-2 -mx-3 space-x-2 transition-all" href="/admin">
      <GlobalOutlined />
      <span className={textClassName}>Admin</span>
    </Link>
  );

  return (
    <div className="space-y-2">
      <h4 className="text-xs leading-none opacity-60">Menu</h4>
      <div className="flex flex-col">
        {navigator.map((item) => (item.type === "link" ? linkItem(item) : aItem(item)))}
        {!state.isLogin && <MenuLoginButton />}
        {state.isLogin && <Admin />}
        <MomentDisplayTypeToggle
          buttonClassName="flex items-center hover:bg-gray-200 rounded px-3 py-2 -mx-3 space-x-2 transition-all"
          labelClassName={textClassName}
        />
      </div>
    </div>
  );
}
