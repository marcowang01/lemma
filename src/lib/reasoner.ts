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
    "Use this tool to complete complex math problems that require multiple steps and logical reasoning. " +
    "The input is the math question that requires multiple steps to solve. Give the reasoner as much context as possible. " +
    "The output is the final solution."

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
    const timeStamp = Date.now()
    for await (const chunk of completion) {
      // @ts-expect-error - this is a property from deepseek that is not part of the openai api
      // https://api-docs.deepseek.com/guides/reasoning_model
      const reasoningContent = chunk.choices[0]?.delta?.reasoning_content as string

      if (reasoningContent) {
        reasoningTokens += reasoningContent
        this.enqueueMessage({ type: "reasoning", stepIdx: timeStamp, content: reasoningContent })
      }
    }

    return reasoningTokens
  }
}
