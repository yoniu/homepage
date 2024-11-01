import { Separator } from "@/components/ui/separator"

import Header from "@/src/components/header"
import Navigator from "@/src/components/navigator"
import Friends from "@/src/components/friends"

import { Inter } from 'next/font/google'

import '@/src/styles/common.scss'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '油油',
  description: 'A Website For My Self',
  icons: {
    icon: "https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div id="root">
          <img className="fixed w-2/3 max-w-96 blur-2xl saturate-100 opacity-50" src="https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg" alt="yoniu" />
          <div className="relative flex justify-center flex-col h-dvh px-8 z-1">
            <Header />
            <Separator className="my-4" />
            <Navigator />
            <Separator className="my-4" />
            { children }
            <Separator className="my-4" />
            <Friends />
          </div>
        </div>
      </body>
    </html>
  )
}