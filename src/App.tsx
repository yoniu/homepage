import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

import Friends from "@/src/components/friends"

export default function App() {

  const handleClickBlog = () => {
    window.open("https://blog.200011.net", "_blank")
  }

  const handleClickAbout = () => {
    window.open("https://blog.200011.net/about", "_blank")
  }

  const handleClickGithub = () => {
    window.open("https://github.com/yoniu", "_blank")
  }

  const handleClickICP = () => {
    window.open("https://beian.miit.gov.cn/", "_blank")
  }

  return (
    <>
      <img className="fixed w-1/2 blur-2xl saturate-100 opacity-50" src="https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg" alt="yoniu" />
      <div className="relative flex justify-center flex-col h-dvh px-8 z-1">
        <div className="flex items-end w-full space-y-1">
          <div className="flex-1">
            <h4 className="text-base font-medium leading-none font-bold">油油</h4>
            <p className="text-sm text-muted-foreground">
              欢迎来到我的个人主页
            </p>
          </div>
          <img className="w-10 rounded" src="https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg" alt="yoniu" />
        </div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center space-x-4 text-sm">
          <div>
            <Button className="py-0 px-0" variant="link" onClick={handleClickBlog}>Blog</Button>
          </div>
          <Separator orientation="vertical" />
          <div>
            <Button className="py-0 px-0" variant="link" onClick={handleClickAbout}>About</Button>
          </div>
          <Separator orientation="vertical" />
          <div>
            <Button className="py-0 px-0" variant="link" onClick={handleClickGithub}>Github</Button>
          </div>
          <Separator orientation="vertical" />
          <div>
            <Button className="py-0 px-0" variant="link" onClick={handleClickICP}>粤ICP备18152975号</Button>
          </div>
        </div>
        <Separator className="my-4" />
        <Friends />
      </div>
    </>
  )
}
