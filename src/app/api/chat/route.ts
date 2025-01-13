import { getSystemPrompt } from "@/lib/prompts"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import {
  AIMessage,
  AIMessageChunk,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages"
import { concat } from "@langchain/core/utils/stream"
import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod"

export const maxDuration = 60

export async function POST(req: Request) {
  const formData = await req.formData()
  const userPrompt = formData.get("userInput") as string

  if (!userPrompt) {
    return new Response("No user prompt provided", { status: 400 })
  }

  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  })

  const wolframAlphaTool = new WolframAlphaTool({
    appid: process.env.WOLFRAM_ALPHA_APP_ID ?? "",
  })
  wolframAlphaTool.name = "wolfram-alpha"
  wolframAlphaTool.description =
    "Use this tool to answer questions about math, science, and other topics. you must provide an input to the tool which represents the query you want to use the tool to evaluate."
  wolframAlphaTool.schema = z
    .object({
      input: z.string().optional().describe("The input to the tool"),
    })
    .transform((data) => data.input)

  const llmWithTools = llm.bindTools([wolframAlphaTool])

  const conversation = [new SystemMessage(getSystemPrompt()), new HumanMessage(userPrompt)]

  async function* handleLLMStream() {
    while (true) {
      const iterator = await llmWithTools.stream(conversation)
      let gathered: AIMessageChunk | undefined = undefined

      for await (const chunk of iterator) {
        console.log(`Chunk: ${JSON.stringify(chunk, null, 2)}`)

        // Stream content back to the client
        if (chunk.content) {
          yield chunk.content
        }
        gathered = gathered !== undefined ? concat(gathered, chunk) : chunk
      }

      // Finalize AI message with accumulated content
      if (gathered) {
        conversation.push(gathered)
      }

      if (!gathered?.tool_calls || gathered?.tool_calls?.length === 0) {
        // No more tool calls, stop iteration
        console.log("No more tool calls, stopping iteration")
        break
      }

      console.log(`Tool calls: ${JSON.stringify(gathered?.tool_calls)}`)

      // Process each tool call
      for (const toolCall of gathered.tool_calls) {
        if (toolCall.name === "wolfram-alpha") {
          try {
            const toolMessage = (await wolframAlphaTool.invoke(toolCall)) as ToolMessage

            console.log(
              `Tool message: ${JSON.stringify(toolMessage)}, tool call: ${JSON.stringify(toolCall)}`
            )

            conversation.push(toolMessage)
            yield `<span style="color: green;">Tool result: ${toolMessage.content}</span>`
          } catch (error) {
            console.error("Tool invocation error:", error)
            yield `<span style="color: red;">Tool invocation failed: ${String(error)}</span>`
          }
        } else {
          console.error("Unknown tool call:", toolCall.name)
          yield `<span style="color: red;">Unknown tool: ${toolCall.name}</span>`
        }
      }
    }
  }

  // Convert async generator to ReadableStream
  const stream = new ReadableStream({
    async pull(controller) {
      const iterator = handleLLMStream()
      try {
        const { value, done } = await iterator.next()
        if (done) {
          controller.close()
        } else {
          controller.enqueue(value)
        }
      } catch (err) {
        console.error("Stream error:", err)
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
