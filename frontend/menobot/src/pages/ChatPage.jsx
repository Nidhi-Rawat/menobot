import ChatbotCard from '../components/ChatbotCard'

function ChatPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <header className="rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-lg shadow-rose-100/40 sm:p-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-rose-500">Assistant</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Ask MenoBot anything
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Use the chat for symptom questions, cycle patterns, nutrition prompts, and gentle wellness guidance.
        </p>
      </header>
      <ChatbotCard fullPage />
    </div>
  )
}

export default ChatPage
