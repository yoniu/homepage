import friend_links from '@/src/configs/friends.json'

interface ILink {
  name: string;
  description: string;
  link: string;
  image: string;
}

function Friend_Item(item: ILink) {
  return (
    <>
      <a className="flex items-center text-xs me-3 mt-2 last:me-0 hover:underline underline-offset-4" href={item.link} target="_blank">
        <img className="me-1 rounded-full w-4" src={item.image} />
        { item.name }
      </a>
    </>
  )
}

export default function Friends() {

  return (
    <>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none font-bold">Links 👭</h4>
        <div className="flex align-items-center flex-wrap max-w-sm">
          {
            friend_links.map((link: ILink) => {
              return Friend_Item(link)
            })
          }
        </div>
      </div>
    </>
  )
}
