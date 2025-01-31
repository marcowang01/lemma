export interface ServerMessage {
  type: "response" | "reasoning" | "error"
  content: string
}

