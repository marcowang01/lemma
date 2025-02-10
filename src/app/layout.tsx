import { Roboto } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
})

const AppleGaramond = localFont({
  src: [
    {
      path: "../fonts/AppleGaramond-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-apple-garamond",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${AppleGaramond.variable}`}>
        <div className="cream-radial-gradient h-screen w-screen">{children}</div>
      </body>
    </html>
  )
}
