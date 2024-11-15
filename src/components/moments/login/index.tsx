"use client";

import { useEffect, useState } from "react";
import { App } from "antd"

import { cn } from "@/lib/utils"

import useIcon from '@/src/hooks/icon'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { login } from "@/src/utils/login";
import { TResponseError } from "@/src/utils/axiosInstance";
import { useStateContext as useUserStateContext } from "@/src/stores/user";
import ReactDOM from "react-dom";

export default function MomentLogin() {
  
  const { message: messageApi } = App.useApp()

  const { dispatch } = useUserStateContext()

  useEffect(() => {
    dispatch({ type: 'UPDATELOGIN' })
  }, [dispatch])

  const IconFont = useIcon()

  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event?.target?.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event?.target?.value)
  }

  const isVisible = () => {
    return visible ? "flex" : "hidden"
  }

  const handleLogin = () => {
    setLoading(true)
    login({ name: username, password }).then((user) => {
      // 登录成功
      messageApi.success("欢迎回来，" + user.name)
      setVisible(false)
      dispatch({ type: 'UPDATELOGIN' })
    })
    .catch((error) => {
      const err = error as TResponseError
      if (Array.isArray(err.message)) {
        err.message.map((msg) => messageApi.error(msg))
      } else {
        messageApi.error(err.message)
      }
    })
    .finally(() => {
      setLoading(false)
    })
  }

  return (
    <>
      <button className="flex flex-col items-center hover:bg-gray-100 text-lg rounded px-3 py-2 space-y-1 transition-all" onClick={() => setVisible(true)}>
        <IconFont className="text-lg" type="icon-yonghu" />
        <span className="text-xs">Login</span>
      </button>
      {
        ReactDOM.createPortal(
          <div className={cn("fixed top-0 left-0 size-full flex flex-col items-center justify-center z-50", isVisible())}>
            <div className="absolute top-0 left-0 size-full bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setVisible(false)}></div>
            <div className="bg-white pt-6 pb-4 px-4 rounded-lg shadow-sm z-10 min-w-80">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" placeholder="Your Username" value={username} onChange={handleUsernameChange} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type="password" id="password" placeholder="Your Password" value={password} onChange={handlePasswordChange} />
                  </div>
                </div>
              </form>
              <div className="flex items-center justify-between mt-3">
                <Button variant="outline" onClick={() => setVisible(false)}>Cancel</Button>
                <Button onClick={handleLogin} disabled={loading}>Login</Button>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  )
}
