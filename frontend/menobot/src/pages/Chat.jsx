import { useState } from 'react'
import { sendMessage } from '../services/api'

function getBotReply(payload) {
  if (typeof payload === 'string') {
    return payload
  }

  return (
    payload?.reply ||
    payload?.response ||
    payload?.message ||
    payload?.answer ||
    payload?.data?.reply ||
    'I am here to help.'
  )
}

function Chat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: 'Hi, I am MenoBot. Ask me anything about your cycle, pain, or wellness.',
    },
  ])
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(event) {
    event.preventDefault()

    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
    }

    setMessages((current) => [...current, userMessage])
    setInput('')
    setError('')
    setIsSending(true)

    try {
      const response = await sendMessage(trimmed)
      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: getBotReply(response),
      }

      setMessages((current) => [...current, botMessage])
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Chat</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Talk with MenoBot
        </h1>
      </header>

      <section className="rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-lg shadow-rose-100/40 sm:p-6">
        <div className="space-y-4 rounded-[28px] bg-[linear-gradient(180deg,#fff7fb,#f8fafc)] p-4 sm:p-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-slate-900 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSend} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about symptoms, pain, meals, or cycle health..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-rose-300 focus:bg-white"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Chat
