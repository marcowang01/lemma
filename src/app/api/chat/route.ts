import { AIMessageChunk } from "@langchain/core/messages"
import { IterableReadableStream } from "@langchain/core/utils/stream"
import { ChatOpenAI } from "@langchain/openai"
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

  const iterator = await llm.stream(userPrompt)

  const stream = llmIteratorToStream(iterator)

  return new Response(stream)
}

// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream
function llmIteratorToStream(iterator: IterableReadableStream<AIMessageChunk>) {
  return new ReadableStream({
    async pull(controller) {
      const { value: AIMessageChunk, done } = await iterator.next()

      if (done) {
        controller.close()
      } else {
        const text = AIMessageChunk.content
        controller.enqueue(text)
      }
    },
  })
}
