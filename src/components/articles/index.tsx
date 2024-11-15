"use client";

import dayFormat from '@/src/utils/dayFormat'

import { useQuery } from 'graphql-hooks'

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
    return dayFormat(date)
  }

  return (
    <div className="space-y-2 mb-4">
      <h4 className="text-sm font-bold leading-none mb-2">最新文章</h4>
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
            <div key={node.id} className="group/article flex items-start justify-between space-x-2">
              <a className="text-xs text-black-600 group-hover/article:font-bold transition-all truncate" target="_blank" href={node.url} rel="noreferrer" title={node.title}>{node.title}</a>
              <span className="shrink-0 text-xs text-gray-500 group-hover/article:font-bold">
                {formatDay(node.publishedAt)}
              </span>
            </div>
          )
        })
      }
    </div>
  )
}
