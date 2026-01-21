import type { Metadata } from "next"
import { PropsWithChildren } from "react"
import { Providers } from "./providers"
import { Header } from "@/components"

import "./globals.css"

export const metadata: Metadata = {
  title: "TSender",
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
