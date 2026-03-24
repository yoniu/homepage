"use client";

import { AppstoreOutlined, TikTokOutlined } from "@ant-design/icons";

import { cn } from "@/lib/utils";
import { useStateContext as useMomentStateContext } from "@/src/stores/moment";

interface IProps {
  buttonClassName: string;
  labelClassName?: string;
}

export default function MomentDisplayTypeToggle({
  buttonClassName,
  labelClassName,
}: IProps) {
  const { state: momentState, dispatch } = useMomentStateContext();

  const isMasonry = momentState.displayType === "masonry";
  const nextDisplayType = isMasonry ? "tiktok" : "masonry";
  const actionLabel = isMasonry ? "Switch to Tiktok" : "Switch to Redbook";
  const buttonLabel = isMasonry ? "Tiktok" : "Redbook";

  return (
    <button
      type="button"
      className={cn(buttonClassName)}
      onClick={() => dispatch({ type: "SETDISPLAYTYPE", displayType: nextDisplayType })}
      title={actionLabel}
      aria-label={actionLabel}
    >
      {isMasonry ? <TikTokOutlined /> : <AppstoreOutlined />}
      <span className={labelClassName}>{buttonLabel}</span>
    </button>
  );
}
