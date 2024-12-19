'use client'

import { useChat } from 'ai/react'
import { ChangeEvent, FormEvent } from 'react'

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  console.log('Current messages:', messages)
  console.log('Current input:', input)

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    try {
      handleSubmit(event)
    } catch (error) {
      console.error('Error during form submission:', error)
    }
  }

  const handleInputChangeWithLog = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      handleInputChange(event)
    } catch (error) {
      console.error('Error during input change:', error)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((m) => (
        <div key={m.id} className="whitespace-pre-wrap">
          {m.role === 'user' ? 'User: ' : 'AI: '}
          {m.content}
        </div>
      ))}

      <form onSubmit={handleFormSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChangeWithLog}
        />
      </form>
    </div>
  )
}