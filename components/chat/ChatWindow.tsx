"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"
import { type ChangeEvent, type FormEvent, type KeyboardEvent, useRef, useState, useEffect } from "react"
import type { Message } from "@/lib/chat-api"
import { Customer } from "./ChatSidebar"

interface ChatWindowProps {
  conversationId?: string
  customer: Customer | null
  messages: Message[]
  loading: boolean
  currentUserId: string
  onSendMessage: (text: string, file?: File | null) => Promise<void> | void
}

export function ChatWindow({
  conversationId,
  customer,
  messages,
  loading,
  currentUserId,
  onSendMessage,
}: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() && !file) return
    await onSendMessage(newMessage.trim(), file)
    setNewMessage("")
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages.length, loading])

  return (
    <Card className="flex-1 p-0 h-full flex flex-col rounded-none border-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{customer ? customer.name : "Select a conversation"}</p>
          <p className="text-xs text-gray-500 truncate">
            {customer?.email || (conversationId ? "Conversation" : "No conversation selected")}
          </p>
        </div>
        {conversationId && <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-blue-50/30">
        {loading && messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">Loading messages...</p>
        )}

        {!loading && !conversationId && (
          <p className="text-xs text-gray-400 text-center mt-4">Start by selecting a conversation on the left.</p>
        )}

        {messages.map((msg) => {
          const isOwn = typeof msg.sender === "string" ? msg.sender === currentUserId : msg.sender._id === currentUserId

          return (
            <div key={msg._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  isOwn ? "bg-[#5B9FED] text-white" : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}

                {msg.attachment && (
                  <a
                    href={msg.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs underline mt-2"
                  >
                    Attachment
                  </a>
                )}

                <p className={`text-[10px] mt-1 opacity-70 text-right ${isOwn ? "text-white" : "text-gray-500"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 bg-white">
        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
        <Button type="button" size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Paperclip className="w-4 h-4" />
        </Button>
        <Input
          placeholder={conversationId ? "Type your message here..." : "Select a conversation first..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!conversationId}
          className="flex-1"
        />
        <Button
          size="sm"
          type="submit"
          className="bg-[#5B9FED] hover:bg-[#4A8FDD] text-white"
          disabled={!conversationId || (!newMessage.trim() && !file)}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {file && (
        <div className="px-4 pb-2 text-[11px] text-gray-500 bg-white">
          Selected file: <span className="font-medium">{file.name}</span>
        </div>
      )}
    </Card>
  )
}
