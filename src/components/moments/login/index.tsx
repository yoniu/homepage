"use client";

import { useState } from "react";
import { message } from "antd"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { login } from "@/src/utils/login";
import { TResponseError } from "@/src/utils/axiosInstance";

interface IProps {
  onLogin: ReturnType<typeof Function>;
}

export default function MomentLogin(props: IProps) {

  const [messageApi, contextHolder] = message.useMessage()

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
      props.onLogin()
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
      {contextHolder}
      <div className="fixed bottom-2 right-2">
        <button className="text-xs text-white bg-black px-2 py-1 rounded-md hover:bg-slate-500 transition-all" onClick={() => setVisible(true)}>
          Moment Login
        </button>
        <div className={cn("fixed top-0 left-0 size-full flex flex-col items-center justify-center z-10", isVisible())}>
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
        </div>
      </div>
    </>
  )
}
