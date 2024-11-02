"use client";

import { GraphQLClient, ClientContext } from 'graphql-hooks'

import { Separator } from "@/components/ui/separator"

import Articles from "@/src/components/articles"
import Friends from "@/src/components/friends"

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

export default function Page() {
  return (
    <>
      <ClientContext.Provider value={client}>
        <Articles />
        <Separator className="my-4" />
        <Friends />
      </ClientContext.Provider>
    </>
  )
}
