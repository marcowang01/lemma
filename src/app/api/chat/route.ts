import { getLlmClient, getMessages, getWolframAlphaTool } from "@/lib/llm"
import { getSystemPrompt } from "@/lib/prompts"
import { handleLLMStream } from "./stream"

export const maxDuration = 60

export async function POST(req: Request) {
  const formData = await req.formData()
  const userPrompt = formData.get("userInput") as string
  const imageInput = formData.get("imageInput") as File

  console.log(`userPrompt: ${userPrompt}`)
  console.log(`imageInput:`, imageInput)

  if (!userPrompt && !(imageInput && imageInput.size > 0)) {
    return new Response("No user prompt provided", { status: 400 })
  }

  const conversation = await getMessages(getSystemPrompt(), userPrompt, imageInput)
  const wolframAlphaTool = getWolframAlphaTool()
  const llmWithTools = getLlmClient().bindTools([wolframAlphaTool])

  // Convert async generator to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false
      try {
        const generator = handleLLMStream(conversation, llmWithTools as any, wolframAlphaTool)
        for await (const chunk of generator) {
          controller.enqueue(chunk)
        }
      } catch (err) {
        console.error("Stream error:", err)
        if (!isClosed) {
          controller.error(err)
          isClosed = true
        }
      } finally {
        if (!isClosed) {
          controller.close()
          isClosed = true
        }
      }
    },
    cancel() {
      // Optional: Add cleanup logic here if needed
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
