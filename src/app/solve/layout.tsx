export default function SolveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-appleGaramond fixed left-4 top-2.5 text-5xl font-normal italic">lemma</h3>
      {children}
    </div>
  )
}
