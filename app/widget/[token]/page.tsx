'use client'

import { useState } from 'react'

export default function WidgetPage({ params }: { params: { token: string } }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, token: params.token }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Erreur, réessaie.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md flex flex-col h-[600px]">
        <div className="bg-black text-white p-4 rounded-t-xl">
          <h2 className="font-semibold">Assistant IA</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-8">
              Bonjour ! Comment puis-je vous aider ?
            </p>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-400">
                En train d'écrire...
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Votre message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
