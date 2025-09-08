import { cn } from '@/lib/utils';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import "./twikoo.scss";

export default function Twikoo(
  {
    id,
    show = false,
    setShow,
  }:
  {
    id: number,
    show?: boolean,
    setShow: (value: boolean) => void
  }
) {
  

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  useEffect(() => {
    if (!id) return
    // 通过 CDN 引入 twikoo js 文件
    const cdnScript = document.createElement('script')
    cdnScript.src = '/js/twikoo.all.min.js'
    cdnScript.async = true

    const loadSecondScript = () => {
      // 执行 twikoo.init() 函数
      const initScript = document.createElement('script')
      initScript.innerHTML = `
            twikoo.init({
              envId: "${process.env.NEXT_PUBLIC_TWIKOO_ENVID as string}",
              el: '#tcomment',
              path: '/moment/?id=${id}'
            });
          `
      initScript.id = 'twikoo-init-id' // 添加唯一的 ID
      document.body.appendChild(initScript)
    }

    // 在 twikoo js 文件加载完成后，再加载执行 twikoo.init() 函数的 js 文件
    cdnScript.addEventListener('load', loadSecondScript)
    document.body.appendChild(cdnScript)

    return () => {
      if (loadSecondScript) {
        cdnScript.removeEventListener('load', loadSecondScript)
      }
      if (cdnScript) {
        document.body.removeChild(cdnScript)
      }
      const secondScript = document.querySelector('#twikoo-init-id')
      if (secondScript) {
        document.body.removeChild(secondScript)
      }
    }
  }, [id, handleWheel])

  // 解决客户端未渲染报错
  const [client, setClient] = useState(false)
  // 解决客户端未渲染报错
  useEffect(()  => {
    setClient(true);
  }, [])
  // 解决客户端未渲染报错
  if (!client) return null

  return createPortal(
    (
      <>
        <div className={
            cn(
              "absolute z-10 top-0 left-0 w-full h-full bg-black/60 transition-all",
              show ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )
          }
          onClick={() => setShow(false)}
        ></div>
        <div
          className={
            cn(
              "absolute w-full max-w-[500px] bottom-0 sm:bottom-4 z-20 left-1/2 -translate-x-1/2 bg-white rounded-t-2xl rounded-b-none sm:rounded-b-2xl overflow-hidden transition-all",
              show ? 'h-3/5 max-h-[400px] border' : 'h-0 border-transparent'
            )
          }
          onWheel={handleWheel}
        >
          <div id="tcomment"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-transparent via-white/80 to-white"></div>
        </div>
      </>
    ),
    document.querySelector('#content') as Element
  )
}
