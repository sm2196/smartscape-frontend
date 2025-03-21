"use client"

import { useEffect, useState } from "react"
import App from "./App"
import "./App.css"

const Page = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Only render the App component after the component has mounted on the client
  return <div className="app-container">{isMounted ? <App /> : null}</div>
}

export default Page

