// reasoner.ts
import { Tool, ToolParams } from "@langchain/core/tools"
import OpenAI from "openai"
import { ServerMessage } from "./types"

/**
 * If you wish to do a standard (non-streaming) tool invocation,
 * you can use a typical Tool with an async `_call()`. Shown here
 * for completeness, though for the final streaming approach
 * we’ll do something custom in route.ts.
 */
export class ReasonerTool extends Tool {
  name = "reasoner"
  description =
    "Use this tool to produce the final refined answer after verifying with wolfram alpha. " +
    "The input is the question/solution text. The output is the final solution."

  enqueueMessage: (message: ServerMessage) => void

  constructor(
    fields: ToolParams & {
      enqueueMessage: (message: ServerMessage) => void
    }
  ) {
    super(fields)
    this.enqueueMessage = fields.enqueueMessage
  }

  async _call(input: string): Promise<string> {
    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY,
    })

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant. Your task is to come up with a step by step solution to solve a particular math problem.",
        },
        { role: "user", content: input },
      ],
      model: "deepseek-reasoner",
      stream: true,
    })

    let reasoningTokens = ""
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content as string
      // @ts-ignore
      const reasoningContent = chunk.choices[0]?.delta?.reasoning_content as string

      if (reasoningContent) {
        reasoningTokens += reasoningContent
        this.enqueueMessage({ type: "reasoning", content: reasoningContent })
      }
    }

    return reasoningTokens
  }
}
