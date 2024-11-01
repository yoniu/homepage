"use client";

import { useQuery } from 'graphql-hooks'
import dayjs from "dayjs"

interface IPost {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
}

const POSTS_QUERY = `query Publication {
  publication(host: "blog.200011.net") {
      isTeam
      title
      posts(first: 5) {
          edges {
              node {
                  id
                  title
                  url
                  publishedAt
              }
          }
      }
  }
}`

export default function Articles() {
  const { loading, error, data } = useQuery(POSTS_QUERY)

  const formatDay = (date: string) => {
    return dayjs(date).format('MMM D, YYYY')
  }

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-bold leading-none mb-2">Articles 📚</h4>
      {
        loading && !error && 
        <div className="text-xs animate-pulse">loading...</div>
      }
      {
        !loading && error && 
        <div className="text-xs animate-pulse">Something Bad Happened.</div>
      }
      {
        !loading &&
        data.publication.posts.edges.map(({ node }: { node: IPost }) => {
          return (
            <div key={node.id} className="group/article flex items-center justify-between space-x-2">
              <a className="text-xs text-black-600 rounded group-hover/article:text-white group-hover/article:bg-black px-0 py-1 group-hover/article:px-2 transition-all" target="_blank" href={node.url} rel="noreferrer">{node.title}</a>
              <span className="text-xs text-gray-500 group-hover/article:text-gray-200">
                {formatDay(node.publishedAt)}
              </span>
            </div>
          )
        })
      }
    </div>
  )
}
