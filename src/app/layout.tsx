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
          <div className="cream-radial-gradient grid h-screen place-items-center">
            <div className="container max-w-[1050px] px-4 py-8">{children}</div>
          </div>
        </FormProvider>
      </body>
    </html>
  )
}
