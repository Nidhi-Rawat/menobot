import ChatbotCard from '../components/ChatbotCard'

function ChatPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <header className="rounded-xl border border-white/70 bg-white/80 p-4 shadow-md shadow-rose-100/30">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">Assistant</p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-slate-900">
          Ask MenoBot anything
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Use the chat for symptom questions, cycle patterns, nutrition prompts, and gentle wellness guidance.
        </p>
      </header>
      <ChatbotCard fullPage />
    </div>
  )
}

export default ChatPage
