import consts from "@/src/configs/consts";

export default function Footer() {

  return (
    <div className="flex items-start justify-end flex-col h-full text-xs mt-3 text-gray-500">
      <span>
        Copyright © 2015-2024 Yoniu.
      </span>
      <span>
        <a className="hover:underline underline-offset-4" href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
          {consts.ICP_BEIAN}
        </a>
      </span>
    </div>
  )
}