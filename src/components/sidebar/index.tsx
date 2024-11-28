'use client';

import { useState } from "react";

import { ClientContext, GraphQLClient } from "graphql-hooks";

import Articles from "@/src/components/articles";
import Footer from "@/src/components/footer";
import Friends from "@/src/components/friends";
import Navigator from "@/src/components/navigator";

import { cn } from "@/lib/utils"

import SidebarSpread from "./spread";

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

export default function Sidebar() {

  const [show, setShow] = useState(false)

  const isShow = () => {
    return show ? 'translate-x-0' : 'translate-x-full'
  }

  const toggleShow = () => {
    setShow(!show)
  }

  return (
    <ClientContext.Provider value={client}>
      <div className={cn("fixed flex flex-col md:static w-56 h-screen md:h-full md:w-full z-50 md:z-0 top-0 right-0 md:right-auto md:top-auto p-4 md:p-0 shadow-lg md:shadow-none transition-all", isShow(), 'md:translate-x-0')}>
        <SidebarSpread show={show} toggleShow={toggleShow} />
        <Navigator />
        <Articles />
        <Friends />
        <Footer />
      </div>
    </ClientContext.Provider>
  )
}