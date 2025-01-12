import katex from "katex"

export function renderLatex(raw: string): string {
  // Block math: \[...\]
  raw = raw.replace(/\\\[((?:\\.|[\s\S])*?)\\\]/g, (_, content) => {
    try {
      return katex.renderToString(content, { displayMode: true })
    } catch (err) {
      console.error("KaTeX block render error:", err)
      return `<span style="color: red;">Invalid block math: ${content}</span>`
    }
  })

  // Inline math: \(...\)
  raw = raw.replace(/\\\(((?:\\.|[\s\S])*?)\\\)/g, (_, content) => {
    try {
      return katex.renderToString(content, { displayMode: false })
    } catch (err) {
      console.error("KaTeX inline render error:", err)
      return `<span style="color: red;">Invalid inline math: ${content}</span>`
    }
  })

  return raw
}
