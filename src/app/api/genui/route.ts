import { getLlmClient, getMessages, getWolframAlphaTool } from "@/lib/llm"
import { getGenUISystemPrompt } from "@/lib/prompts"
import { transform } from "@babel/standalone"
import { ToolMessage } from "@langchain/core/messages"
import { getFirstFromTag } from "./utils"

export async function POST(req: Request) {
  const formData = await req.formData()
  const userPrompt = formData.get("userInput") as string
  const imageInput = formData.get("imageInput") as File

  console.log(`userPrompt: ${userPrompt}`)
  console.log(`imageInput:`, imageInput)

  const conversation = await getMessages(getGenUISystemPrompt(), userPrompt, imageInput)
  const wolframAlphaTool = getWolframAlphaTool()
  const llmWithTools = getLlmClient().bindTools([wolframAlphaTool])

  let textContent = ""
  while (true) {
    const response = await llmWithTools.invoke(conversation)
    console.log(`genui llm response: ${JSON.stringify(response, null, 2)}`)

    conversation.push(response)

    if (response.content && response.tool_calls?.length === 0) {
      if (typeof response.content === "string") {
        textContent = response.content
      } else if (response.content.length > 0 && response.content[0].type === "text_delta") {
        textContent = response.content[0].text
      }
      break
    }

    if (response.tool_calls?.length && response.tool_calls?.length > 0) {
      for (const toolCall of response.tool_calls) {
        if (toolCall.name === "wolfram-alpha") {
          try {
            const toolMessage = (await wolframAlphaTool.invoke(toolCall)) as ToolMessage

            conversation.push(toolMessage)
          } catch (error) {
            console.error("Tool invocation error:", error)
          }
        } else {
          console.error("Unknown tool call:", toolCall.name)
        }
      }
    }
  }

  if (!textContent) {
    return Response.json({ error: "UI failed to generate text content" }, { status: 500 })
  }

  const content = textContent
  const llmCode = getFirstFromTag(content, "code")

  if (!llmCode) {
    return Response.json({ error: "UI failed to generate code" }, { status: 500 })
  }

  const code = transformCode(llmCode ?? "")

  return Response.json({ code: code })
}

function transformCode(code: string): string {
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
