"use client"

import { useEffect, useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { io as socketIOClient, type Socket } from "socket.io-client"
import { chatApi, type Conversation, type Message, type Participant } from "@/lib/chat-api"

import { toast } from "sonner"
import { ChatSidebar, Customer } from "@/components/chat/ChatSidebar"
import { ChatWindow } from "@/components/chat/ChatWindow"

const getOtherParticipant = (conv: Conversation, currentUserId: string): Participant | null => {
  return conv.participants.find((p) => p._id !== currentUserId) ?? null
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const currentUserId = (session?.user as any)?.id || ""

  console.log("[v0] Messages Page - Session:", {
    hasSession: !!session,
    userId: currentUserId,
    accessToken: (session?.user as any)?.accessToken,
    user: session?.user,
  })

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log("[v0] Loading conversations...")
        const convs = await chatApi.listConversations()
        console.log("[v0] Conversations loaded:", convs.length)
        setConversations(convs)

        const mappedCustomers: Customer[] = convs
          .map((conv) => {
            const other = getOtherParticipant(conv, currentUserId)
            if (!other) return null
            return {
              id: other._id,
              name: other.name,
              email: other.email,
              conversationId: conv._id,
              lastMessagePreview: "",
            } as Customer
          })
          .filter(Boolean) as Customer[]

        setCustomers(mappedCustomers)
      } catch (err) {
        console.error("[v0] Failed to load conversations", err)
        toast.error("Failed to load conversations")
      }
    }

    if (currentUserId) {
      void loadConversations()
    }
  }, [currentUserId])

  // Socket setup
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || ""
    if (!socketUrl) return

    const s = socketIOClient(socketUrl, {
      withCredentials: true,
    })
    setSocket(s)

    return () => {
      s.disconnect()
    }
  }, [])

  // Join room + listen for new messages when conversation changes
  useEffect(() => {
    if (!socket || !selectedConversation?._id) return

    const roomId = selectedConversation._id.toString()
    socket.emit("join", roomId)

    const handleIncomingMessage = (payload: { data: Message[] }) => {
      if (!payload?.data?.length) return
      const newMsg = payload.data[0]
      if (newMsg.conversation === roomId) {
        setMessages((prev) => [...prev, newMsg])
      }
    }

    socket.on("message", handleIncomingMessage)

    return () => {
      socket.off("message", handleIncomingMessage)
    }
  }, [socket, selectedConversation?._id])

  const loadMessages = async (conversation: Conversation) => {
    setLoadingMessages(true)
    try {
      console.log("[v0] Loading messages for conversation:", conversation._id)
      const msgs = await chatApi.getMessages(conversation._id)
      console.log("[v0] Messages loaded:", msgs.length)
      setMessages(msgs)
      await chatApi.markRead(conversation._id)
    } catch (err) {
      console.error("[v0] Failed to load messages", err)
      toast.error("Failed to load messages")
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer)

    const conv = conversations.find((c) => c._id === customer.conversationId) || null

    if (conv) {
      setSelectedConversation(conv)
      await loadMessages(conv)
    } else if (customer.id) {
      // no conversation yet – create one
      try {
        const newConv = await chatApi.getOrCreateConversation(customer.id)
        setConversations((prev) => {
          const exists = prev.find((c) => c._id === newConv._id)
          if (exists) return prev
          return [newConv, ...prev]
        })

        setSelectedConversation(newConv)
        await loadMessages(newConv)

        setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, conversationId: newConv._id } : c)))
      } catch (err) {
        console.error("[v0] Failed to create conversation", err)
        toast.error("Failed to create conversation")
      }
    }
  }

  const handleStartConversation = async (customer: Customer) => {
    await handleSelectCustomer(customer)
  }

  const receiverId = useMemo(() => {
    if (!selectedConversation) return selectedCustomer?.id
    const other = getOtherParticipant(selectedConversation, currentUserId)
    return other?._id ?? selectedCustomer?.id
  }, [selectedConversation, selectedCustomer, currentUserId])

  const handleSendMessage = async (text: string, file?: File | null) => {
    if (!selectedConversation || !receiverId) return
    try {
      console.log("[v0] Sending message:", { text, hasFile: !!file, receiverId })
      const newMsg = await chatApi.sendMessage(selectedConversation._id, {
        text,
        receiverId,
        file,
      })
      console.log("[v0] Message sent successfully:", newMsg._id)
      setMessages((prev) => [...prev, newMsg])
    } catch (err) {
      console.error("[v0] Failed to send message", err)
      toast.error("Failed to send message")
    }
  }

  return (
    <div className="space-y-6 h-full">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>

      <div className="flex h-[600px] bg-white gap-0 border rounded-xl overflow-hidden">
        <ChatSidebar
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={handleSelectCustomer}
          onStartConversation={handleStartConversation}
        />
        <ChatWindow
          conversationId={selectedConversation?._id}
          customer={selectedCustomer}
          messages={messages}
          loading={loadingMessages}
          currentUserId={currentUserId}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}
