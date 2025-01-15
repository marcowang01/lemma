import VersionToggle from "@/components/core/version-toggle"
import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <VersionToggle />
        {children}
      </body>
    </html>
  )
}
