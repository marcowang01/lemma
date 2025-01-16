import { imageFileToBase64 } from "@/app/api/chat/utils"
import { ChatAnthropic } from "@langchain/anthropic"
import { WolframAlphaTool } from "@langchain/community/tools/wolframalpha"
import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { Tool } from "@langchain/core/tools"
import { z } from "zod"

export function getLlmClient() {

  // return new ChatOpenAI({
  //   model: "gpt-4o-mini",
  //   temperature: 0,
  // })

  return new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
  })
}

export function getWolframAlphaTool() {
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

  return wolframAlphaTool
}


export async function getMessages(
  systemPropmt: string,
  userPrompt: string,
  imageInput: File | null
) {
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

  return [
    new SystemMessage(systemPropmt),
    new HumanMessage({
      content: messageContent,
    }),
  ]
}
