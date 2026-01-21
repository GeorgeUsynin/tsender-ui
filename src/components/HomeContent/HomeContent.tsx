"use client"

import { AirdropForm } from "../AirdropForm"
import { useConnection } from "wagmi"

export const HomeContent = () => {
  const { isConnected, status } = useConnection()
  console.log("isConnected", isConnected)

  return (
    <div>
      {status === "connected" ? (
        <div>
          <AirdropForm />
        </div>
      ) : (
        <div className="flex justify-center p-4">
          Please connect your wallet...
        </div>
      )}
    </div>
  )
}
