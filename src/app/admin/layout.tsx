import { Inter } from 'next/font/google'

import '@/src/styles/common.scss'
import '@/styles/globals.css'
import { App, ConfigProvider } from 'antd'
import { AntdRegistry } from '@ant-design/nextjs-registry'

import { StateProvider as PlayerStateProvider } from '@/src/stores/audio';
import { StateProvider as UserStateProvider } from '@/src/stores/user';
import { StateProvider as EditorStateProvider } from '@/src/stores/editor';
import { StateProvider as EditorMomentProvider } from '@/src/stores/moment';
import V6Analyze from '@/src/components/analyze/V6'

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
        <AntdRegistry>
          <ConfigProvider theme={{
            token: {
              colorLink: '#333',
            },
          }}>
            <App>
              <UserStateProvider>
                <PlayerStateProvider>
                  <EditorStateProvider>
                    <EditorMomentProvider>
                      <div id="root" className="space-x-0 justify-center px-4 py-4 md:space-x-8 md:justify-between md:px-8 md:py-12">
                      { children }
                      </div>
                    </EditorMomentProvider>
                  </EditorStateProvider>
                </PlayerStateProvider>
              </UserStateProvider>
            </App>
          </ConfigProvider>
        </AntdRegistry>
        <V6Analyze />
      </body>
    </html>
  )
}