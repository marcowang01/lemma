import { AIMessageChunk } from "@langchain/core/messages"
import { IterableReadableStream } from "@langchain/core/utils/stream"
import { ChatOpenAI } from "@langchain/openai"
export const maxDuration = 60

export async function POST(req: Request) {
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  })

  const iterator = await llm.stream("Hello! Tell me about yourself.")

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

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}

const encoder = new TextEncoder()

async function* makeIterator() {
  yield encoder.encode("<p>One</p>")
  await sleep(200)
  yield encoder.encode("<p>Two</p>")
  await sleep(200)
  yield encoder.encode("<p>Three</p>")
}
