"use client";

import { useEffect, useState } from "react";
import useLeancloud from "@/src/hooks/leancloud";

import MomentLogin from "@/src/components/moments/login";


export default function Page() {
  const AV = useLeancloud();

  const [login, setLogin] = useState(false)

  useEffect(() => {
    if (AV.User.current() ) {
      setLogin(true)
    }
  }, [])

  const handleLogin = () => {
    setLogin(true)
  }

  return (
    <>
      { !login && <MomentLogin onLogin={handleLogin} /> }
    </>
  )
}
