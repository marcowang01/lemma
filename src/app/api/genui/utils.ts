/**
 * Extracts content from XML-style tags in a string
 * @param text The input text containing XML-style tags
 * @param tagName The name of the tag to extract content from
 * @returns Array of extracted content strings
 */
export function extractFromTags(text: string, tagName: string): string[] {
  // Create opening and closing tag patterns
  const openTag = `<${tagName}>`
  const closeTag = `</${tagName}>`
  
  const results: string[] = []
  let currentIndex = 0
  
  while (true) {
    // Find the next opening tag
    const startIndex = text.indexOf(openTag, currentIndex)
    if (startIndex === -1) break
    
    // Find the matching closing tag
    const endIndex = text.indexOf(closeTag, startIndex)
    if (endIndex === -1) break
    
    // Extract the content between tags
    const content = text.slice(
      startIndex + openTag.length,
      endIndex
    ).trim()
    
    results.push(content)
    currentIndex = endIndex + closeTag.length
  }
  
  return results
}

/**
 * Gets the first occurrence of content within specified XML-style tags
 * @param text The input text containing XML-style tags
 * @param tagName The name of the tag to extract content from
 * @returns The first matching content or null if no match found
 */
export function getFirstFromTag(text: string, tagName: string): string | null {
  const matches = extractFromTags(text, tagName)
  return matches.length > 0 ? matches[0] : null
}