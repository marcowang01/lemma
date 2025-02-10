import Link from "next/link"

export default function SolveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Link
        href="/"
        className="font-appleGaramond fixed left-4 top-2.5 text-5xl font-normal italic"
      >
        lemma
      </Link>
      {children}
    </div>
  )
}
