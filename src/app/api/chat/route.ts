import { getLlmClient, getMessages, getWolframAlphaTool } from "@/lib/llm"
import { getSystemPrompt } from "@/lib/prompts"
import { ReasonerTool } from "@/lib/reasoner"
import { ServerMessage } from "@/lib/types"
import { ChatAnthropicCallOptions } from "@langchain/anthropic"
import { BaseLanguageModelInput } from "@langchain/core/language_models/base"
import { AIMessageChunk } from "@langchain/core/messages"
import { Runnable } from "@langchain/core/runnables"
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

  // Convert async generator to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false

      const enqueueMessage = (message: ServerMessage) => {
        controller.enqueue(JSON.stringify(message) + "\n")
      }

      const conversation = await getMessages(getSystemPrompt(), userPrompt, imageInput)
      const wolframAlphaTool = getWolframAlphaTool()
      const reasonerTool = new ReasonerTool({ enqueueMessage })
      const llmWithTools = getLlmClient().bindTools([wolframAlphaTool, reasonerTool])

      try {
        const generator = handleLLMStream(
          conversation,
          llmWithTools as Runnable<
            BaseLanguageModelInput,
            AIMessageChunk,
            ChatAnthropicCallOptions
          >,
          wolframAlphaTool,
          reasonerTool
        )
        for await (const chunk of generator) {
          enqueueMessage(chunk)
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
