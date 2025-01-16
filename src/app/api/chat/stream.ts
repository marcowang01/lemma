import { ChatAnthropicCallOptions } from "@langchain/anthropic"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { BaseLanguageModelInput } from "@langchain/core/language_models/base"
import { AIMessageChunk, BaseMessage, ToolMessage } from "@langchain/core/messages"
import { Runnable } from "@langchain/core/runnables"
import { concat } from "@langchain/core/utils/stream"

export async function* handleLLMStream(
  conversation: BaseMessage[],
  llmWithTools: Runnable<BaseLanguageModelInput, AIMessageChunk, ChatAnthropicCallOptions>,
  wolframAlphaTool: WolframAlphaTool
) {
  while (true) {
    const iterator = await llmWithTools.stream(conversation)
    let gathered: AIMessageChunk | undefined = undefined

    for await (const chunk of iterator) {
      // Stream content back to the client
      if (chunk.tool_calls?.length === 0 && chunk.content && chunk.getType() === "ai") {
        console.log("Chunk content:", chunk.content)

        if (typeof chunk.content === "string") {
          yield chunk.content
        } else if (chunk.content.length > 0 && chunk.content[0].type === "text_delta") {
          yield chunk.content[0].text
        }
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
