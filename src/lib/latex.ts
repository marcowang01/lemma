import katex from "katex"

export function renderLatex(raw: string): string {
  // Helper function to handle KaTeX rendering with error handling
  const renderWithKatex = (content: string, displayMode: boolean): string => {
    try {
      return katex.renderToString(content, { displayMode })
    } catch (err) {
      console.error(`KaTeX ${displayMode ? "block" : "inline"} render error:`, err)
      return `<span style="color: red;">Invalid ${displayMode ? "block" : "inline"} math: ${content}</span>`
    }
  }

  // Block math: \[...\]
  raw = raw.replace(/\\\[((?:\\.|[^\\\]])*?)\\\]/g, (match, content) => {
    return renderWithKatex(content, true)
  })

  // Inline math: \(...\)
  raw = raw.replace(/\\\(((?:\\.|[^\\\)])*?)\\\)/g, (match, content) => {
    return renderWithKatex(content, false)
  })

  // Block math: $$...$$
  // Match pairs of double dollars, being careful not to be greedy
  raw = raw.replace(/\$\$((?:\\.|[^\$])*?)\$\$/g, (match, content) => {
    return renderWithKatex(content, true)
  })

  // Inline math: $...$
  // Match single dollars, but not inside already processed blocks
  // Use negative lookbehind and lookahead to avoid matching '$' inside already processed KaTeX
  raw = raw.replace(/(?<!\\)\$(?!\$)((?:\\.|[^\$])*?)(?<!\\)\$(?!\$)/g, (match, content) => {
    return renderWithKatex(content.trim(), false)
  })

  return raw
}

// Example usage:
/*
const text = `
Here are some inline math expressions: $x$ and $y$ and $z$.
And here's a block math expression:
$$
\sum_{i=1}^n x_i
$$
You can also use \(a + b\) or \[c + d\] notation.
`
*/
