import { Inter } from 'next/font/google'

import '@/src/styles/common.scss'
import '@/styles/globals.css'
import Sidebar from "../components/sidebar"

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
        <div id="root" className="space-x-0 justify-center px-4 py-4 md:space-x-8 md:justify-between md:px-8 md:py-12">
          <div id="main">
            { children }
          </div>
          <div id="sidebar">
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  )
}