"use client";

import friend_links from '@/src/configs/friends.json'

interface ILink {
  name: string;
  description: string;
  link: string;
  image: string;
}

function Friend_Item(item: ILink) {
  return (
    <a className="flex items-center hover:bg-gray-300 rounded px-3 py-2 -mx-3 space-x-2 transition-all" href={item.link} key={item.name} target="_blank" rel="noreferrer">
      <img className="rounded w-6" src={item.image} alt={item.name} />
      <span className="text-sm">{ item.name }</span>
    </a>
  )
}

export default function Friends() {

  return (
    <div className="space-y-2">
      <h4 className="text-xs leading-none opacity-60">Links</h4>
      <div className="flex flex-col">
        {
          friend_links.map((link: ILink) => {
            return Friend_Item(link)
          })
        }
      </div>
    </div>
  )
}
