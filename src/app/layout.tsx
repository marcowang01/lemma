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
    <html lang="en" className="h-full">
      <body className={`${roboto.variable} ${AppleGaramond.variable} h-full`}>
        <FormProvider>
          <div className="cream-radial-gradient fixed inset-0 h-full w-full" />
          <div className="relative h-full overflow-auto">
            <div className="grid min-h-full place-items-center">
              <div className="container max-w-[1050px] px-4 py-8">{children}</div>
            </div>
          </div>
        </FormProvider>
      </body>
    </html>
  )
}
