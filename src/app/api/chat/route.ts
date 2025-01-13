import { getSystemPrompt } from "@/lib/prompts"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { BaseLanguageModelInput } from "@langchain/core/language_models/base"
import {
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages"
import { Runnable } from "@langchain/core/runnables"
import { concat } from "@langchain/core/utils/stream"
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai"
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

async function* handleLLMStream(
  conversation: BaseMessage[],
  llmWithTools: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatOpenAICallOptions>,
  wolframAlphaTool: WolframAlphaTool
) {
  while (true) {
    const iterator = await llmWithTools.stream(conversation)
    let gathered: AIMessageChunk | undefined = undefined

    for await (const chunk of iterator) {
      // Stream content back to the client
      if (chunk.tool_calls?.length === 0 && chunk.content && chunk.getType() === "ai") {
        yield chunk.content
      }
      gathered = gathered !== undefined ? concat(gathered, chunk) : chunk
    }

    console.log(`iteration done Gathered: ${JSON.stringify(gathered, null, 2)}`)

    // Finalize AI message with accumulated content
    if (gathered) {
      conversation.push(gathered)
    }

    if (!gathered?.tool_calls || gathered?.tool_calls?.length === 0) {
      // No more tool calls, stop iteration
      console.log("No more tool calls, stopping iteration")
      break
    }

    // Process each tool call
    for (const toolCall of gathered.tool_calls) {
      if (toolCall.name === "wolfram-alpha") {
        try {
          const toolMessage = (await wolframAlphaTool.invoke(toolCall)) as ToolMessage

          conversation.push(toolMessage)
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
