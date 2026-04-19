import { useState } from 'react'
import { sendChatMessage } from '../services/api'

const initialMessages = [
  {
    id: 1,
    role: 'assistant',
    content: 'Hi, I am MenoBot. Ask me about symptoms, cycle patterns, nutrition, or daily wellness support.',
  },
]

function getAssistantReply(response) {
  if (typeof response === 'string') {
    return response
  }

  return (
    response?.reply ||
    response?.response ||
    response?.message ||
    response?.answer ||
    response?.data?.reply ||
    response?.data?.response ||
    'I received your message and I am here to support you.'
  )
}

export function useChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function submitMessage(content) {
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
    }

    setMessages((current) => [...current, userMessage])
    setIsSending(true)
    setError('')

    try {
      const response = await sendChatMessage(content)
      const reply = getAssistantReply(response)

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: reply,
        },
      ])
    } catch (sendError) {
      setError(sendError.message || 'Unable to send message right now.')
    } finally {
      setIsSending(false)
    }
  }

  return {
    messages,
    isSending,
    error,
    submitMessage,
  }
}
