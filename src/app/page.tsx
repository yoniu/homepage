"use client";

import { GraphQLClient, ClientContext } from 'graphql-hooks'

import Articles from "@/src/components/articles"

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

export default function Page() {
  return (
    <>
      <ClientContext.Provider value={client}>
        <Articles />
      </ClientContext.Provider>
    </>
  )
}
