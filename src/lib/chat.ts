import { END, MemorySaver, MessagesAnnotation, START, StateGraph } from "@langchain/langgraph"
import { v4 as uuidv4 } from "uuid"

const config = { configurable: { thread_id: uuidv4() } }

export interface LlmResponse {
  errorMessage?: string
  messageStream?: AsyncIterable<string>
}

async function* callLlm(
  formData: FormData,
  onReceiveText: (text: string) => void
): AsyncGenerator<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    console.error("Failed to fetch response", response)
    yield "Failed to fetch response"
    return 
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    const text = decoder.decode(value, { stream: true })
    onReceiveText(text)
    yield text
  }
}

const callModel = async (state: typeof MessagesAnnotation.State) => {
  // make fetch here
  const response = await llm.invoke(state.messages)
  return { messages: response }
}

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END)

// Add memory
const memory = new MemorySaver()
const app = workflow.compile({ checkpointer: memory })
