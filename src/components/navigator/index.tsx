import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

export default function Navigator() {

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
  )
}
