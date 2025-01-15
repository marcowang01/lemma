import { getGenUISystemPrompt } from "@/lib/prompts"
import { transform } from "@babel/standalone"
import { ChatAnthropic } from "@langchain/anthropic"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { BaseMessage, HumanMessage, SystemMessage, ToolMessage } from "@langchain/core/messages"
import { z } from "zod"
import { imageFileToBase64 } from "../chat/utils"
import { getFirstFromTag } from "./utils"

export async function POST(req: Request) {
  const formData = await req.formData()
  const userInput = formData.get("userInput") as string
  const imageInput = formData.get("imageInput") as File

  const llm = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
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

  let messageContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
    { type: "text", text: userInput },
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
    new SystemMessage(getGenUISystemPrompt()),
    new HumanMessage({
      content: userInput,
    }),
  ]

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
  // const content = smartDummyCode
  let llmCode = getFirstFromTag(content, "code")

  if (!llmCode) {
    return Response.json({ error: "UI failed to generate code" }, { status: 500 })
  }

  // llmCode = dummyCode

  let code = createComponent(llmCode ?? "")

  console.log(`final code: ${code}`)

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
