"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip } from "lucide-react"
import { useState } from "react"

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Guy Hawkins",
      message:
        "Hey, I'd like to have your contact information if you're comfortable sharing it. Let me know if you have any questions!",
      timestamp: "2:22 PM",
      isOwn: false,
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isOwn: true,
        },
      ])
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 p-4 h-fit">
          <Input placeholder="Search" className="mb-4" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                <p className="font-medium text-sm">Guy Hawkins</p>
                <p className="text-xs text-gray-500 truncate">Lorem ipsum dolor sit amet</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 p-6 flex flex-col h-96">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className="flex-1">
              <p className="font-medium">Interested in your contact</p>
              <p className="text-xs text-gray-500">From jonny@example.com</p>
            </div>
            <span className="w-2 h-2 bg-green-500 rounded-full" />
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${msg.isOwn ? "bg-blue-600 text-white" : "bg-blue-50 text-gray-900"}`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button size="sm" variant="outline">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
