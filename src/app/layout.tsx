import { FormProvider } from "@/app/context/form-context"
import localFont from "next/font/local"
import "./globals.css"

const roboto = localFont({
  src: [
    {
      path: "../fonts/Roboto-Italic-VariableFont_wdth,wght.ttf",
      style: "italic",
    },
    {
      path: "../fonts/Roboto-VariableFont_wdth,wght.ttf",
      style: "normal",
    },
  ],
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
        <FormProvider>
          <div className="cream-radial-gradient h-screen w-screen">{children}</div>
        </FormProvider>
      </body>
    </html>
  )
}
