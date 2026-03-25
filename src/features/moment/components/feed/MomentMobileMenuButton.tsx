"use client";

import { MenuOutlined } from "@ant-design/icons";

import { useStateContext as useUserStateContext } from "@/src/stores/user";

export default function MomentMobileMenuButton() {
  const { state: userState, dispatch: userDispatch } = useUserStateContext();

  return (
    <button
      type="button"
      className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-lg transition-all"
      onClick={() => userDispatch({ type: "SETMENUSHOW", show: !userState.menuShow })}
      aria-label="Open navigation menu"
      title="Open navigation menu"
    >
      <MenuOutlined />
    </button>
  );
}
