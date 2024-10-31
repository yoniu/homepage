export default function Header() {
  return (
    <div className="flex items-end w-full space-y-1">
      <div className="flex-1">
        <h4 className="text-base font-medium leading-none font-bold">油油</h4>
        <p className="text-sm text-muted-foreground">
          欢迎来到我的个人主页
        </p>
      </div>
      <img className="w-10 rounded" src="https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg" alt="yoniu" />
    </div>
  )
}