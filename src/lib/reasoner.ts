// reasoner.ts
import { Tool } from "@langchain/core/tools"
import { ChatOpenAI } from "@langchain/openai"
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

  // We won't do chunk-based streaming here. This is a simple single response example.
  async _call(input: string): Promise<string> {
    const llm = new ChatOpenAI({
      model: "deepseek-reasoner",
      openAIApiKey: process.env.DEEPSEEK_API_KEY,
      configuration: {
        baseURL: "https://api.deepseek.com",
      },
    })

    const response = await llm.invoke(input)

    console.log(`deepseekresponse: ${JSON.stringify(response, null, 2)}`)

    return "failed to reason on input. do not try again."
  }
}
