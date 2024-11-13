'use client';

import { ClientContext, GraphQLClient } from "graphql-hooks";
import Articles from "@/src/components/articles";
import Footer from "@/src/components/footer";
import Friends from "@/src/components/friends";
import Navigator from "@/src/components/navigator";

const client = new GraphQLClient({
  url: 'https://gql.hashnode.com'
})

export default function Sidebar() {
  return (
    <>
      <ClientContext.Provider value={client}>
        <Navigator />
        <Articles />
        <Friends />
        <Footer />
      </ClientContext.Provider>
    </>
  )
}