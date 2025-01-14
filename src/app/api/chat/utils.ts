export async function imageFileToBase64(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const base64String = Buffer.from(uint8Array).toString("base64")
  return base64String
}
