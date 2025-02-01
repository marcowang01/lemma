export interface ServerMessage {
  type: "response" | "reasoning" | "error"
  stepIdx: number
  content: string
}
