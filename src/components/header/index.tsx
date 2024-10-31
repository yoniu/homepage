import Avatar from "@/src/components/avatar"

export default function Header() {
  return (
    <div className="flex items-end w-full space-y-1">
      <div className="flex-1">
        <h4 className="text-base leading-none font-bold">油油</h4>
        <p className="text-sm text-muted-foreground">
          欢迎来到我的个人主页
        </p>
      </div>
      <Avatar />
    </div>
  )
}
