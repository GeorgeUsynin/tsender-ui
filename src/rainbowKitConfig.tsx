"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil, sepolia, zksync } from "wagmi/chains"

const isDev = process.env.NODE_ENV == "development"

export default getDefaultConfig({
  appName: "TSender",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: isDev ? [anvil, sepolia, zksync] : [sepolia, zksync],
  ssr: false,
})
