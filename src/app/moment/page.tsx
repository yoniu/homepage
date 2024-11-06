"use client";

import { useEffect, useState } from "react";

import { logged } from "@/src/utils/login";

import MomentLogin from "@/src/components/moments/login";


export default function Page() {

  const [login, setLogin] = useState(false)

  useEffect(() => {
    if (logged()) {
      setLogin(true)
    }
  }, [setLogin])

  const handleLogin = () => {
    setLogin(true)
  }

  return (
    <>
      { !login && <MomentLogin onLogin={handleLogin} /> }
    </>
  )
}
