import { getSystemPrompt } from "@/lib/prompts"
import { ChatAnthropic } from "@langchain/anthropic"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { z } from "zod"
import { handleLLMStream } from "./stream"
import { imageFileToBase64 } from "./utils"

export const maxDuration = 60

export async function POST(req: Request) {
  const formData = await req.formData()
  const userPrompt = formData.get("userInput") as string
  const imageInput = formData.get("imageInput") as File

  if (!userPrompt) {
    return new Response("No user prompt provided", { status: 400 })
  }

  const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
  })

  // const llm = new ChatOpenAI({
  //   model: "gpt-4o-mini",
  //   temperature: 0,
  // })

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

  let messageContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
    { type: "text", text: userPrompt },
  ]

  if (imageInput && imageInput.size > 0) {
    try {
      const base64String = await imageFileToBase64(imageInput)
      const mimeType = imageInput.type || "image/jpeg"
      messageContent.push({
        type: "image_url",
        image_url: { url: `data:${mimeType};base64,${base64String}` },
      })
    } catch (error) {
      console.error("Error processing image:", error)
    }
  }

  const conversation: BaseMessage[] = [
    new SystemMessage(getSystemPrompt()),
    new HumanMessage({
      content: messageContent,
    }),
  ]

  // Convert async generator to ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      let isClosed = false
      try {
        const generator = handleLLMStream(conversation, llmWithTools, wolframAlphaTool)
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
