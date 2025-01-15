import { getGenUISystemPrompt } from "@/lib/prompts"
import { transform } from "@babel/standalone"
import { ChatAnthropic } from "@langchain/anthropic"
import { BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getFirstFromTag } from "./utils"

export async function POST(req: Request) {
  const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
  })

  const conversation: BaseMessage[] = [
    new SystemMessage(getGenUISystemPrompt()),
    new HumanMessage({
      content: "give me the solution to the problem (3x^3+2x-5)(4x-3) simplify and expand",
    }),
  ]

  const response = await llm.invoke(conversation)

  console.log(`genui llm response: ${JSON.stringify(response, null, 2)}`)

  const content = response.content as string
  // const content = smartDummyCode
  let llmCode = getFirstFromTag(content, "code")

  if (!llmCode) {
    return Response.json({ error: "UI failed to generate" }, { status: 500 })
  }

  // llmCode = dummyCode

  const code = createComponent(llmCode ?? "")
  return Response.json({ code: code })
}

export function createComponent(code: string): string {
  // Transform JSX to JavaScript
  const transformed = transform(code, {
    presets: ["react", "typescript"],
    filename: "dynamic.tsx",
    configFile: false,
    babelrc: false,
  }).code

  if (!transformed) {
    throw new Error("Transformation failed")
  }

  return transformed
}
