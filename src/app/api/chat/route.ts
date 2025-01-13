import { getSystemPrompt } from "@/lib/prompts"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod"
import { handleLLMStream } from "./stream"

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

  const conversation: BaseMessage[] = [
    new SystemMessage(getSystemPrompt()),
    new HumanMessage(userPrompt),
  ]

  // Convert async generator to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = handleLLMStream(conversation, llmWithTools, wolframAlphaTool)
        for await (const chunk of generator) {
          controller.enqueue(chunk)
        }
        controller.close()
      } catch (err) {
        console.error("Stream error:", err)
        controller.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
