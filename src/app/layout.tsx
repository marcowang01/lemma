import "./globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="cream-radial-gradient h-screen w-screen">{children}</div>
      </body>
    </html>
  )
}
