import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChat } from '../hooks/useChat'

const quickPrompts = [
  'What can help with cramps today?',
  'What should I eat during this phase?',
  'Why is my pain score changing?',
]

function ChatbotCard({ fullPage = false }) {
  const [input, setInput] = useState('')
  const { messages, isSending, error, submitMessage } = useChat()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmed = input.trim()
    if (!trimmed) return

    await submitMessage(trimmed)
    setInput('')
  }

  const containerClass = fullPage
    ? 'rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-lg shadow-rose-100/40 sm:p-6'
    : 'rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-lg shadow-rose-100/40'

  const messagePanelClass = fullPage
    ? 'mt-6 h-[420px] overflow-y-auto rounded-[28px] bg-[linear-gradient(180deg,#fff7fb,#f8fafc)] p-4 sm:p-5'
    : 'mt-6 h-[320px] overflow-y-auto rounded-[28px] bg-[linear-gradient(180deg,#fff7fb,#f8fafc)] p-4'

  return (
    <section className={containerClass}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Support</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Chat with MenoBot</h3>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Online
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700 transition hover:border-rose-200 hover:bg-rose-100"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className={messagePanelClass}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-7 shadow-sm sm:px-5 ${
                message.role === 'user'
                  ? 'ml-auto bg-slate-900 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">
                {message.role === 'user' ? 'You' : 'MenoBot'}
              </p>
              <p>{message.content}</p>
            </div>
          ))}

          {isSending ? (
            <div className="max-w-[88%] rounded-3xl bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-60">MenoBot</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-300 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-pulse rounded-full bg-rose-200 [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about symptoms, cycle changes, meals, or daily wellness..."
          className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-300"
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </form>

      {!fullPage ? (
        <Link
          to="/chat"
          className="mt-4 inline-flex text-sm font-semibold text-rose-600 transition hover:text-rose-700"
        >
          Open full chat
        </Link>
      ) : null}
    </section>
  )
}

export default ChatbotCard
