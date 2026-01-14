import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  Trash2,
  Loader2,
  MessageSquare,
  Search,
} from "lucide-react";
import chatService from "../api/chatService";

export default function ChatPage() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch chats on mount
  useEffect(() => {
    fetchChats();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await chatService.getChats();
      setChats(response.data || []);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    setLoadingMessages(true);
    try {
      const response = await chatService.getMessages(chatId);
      setMessages(response.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageContent = newMessage;
    setNewMessage("");
    setSending(true);

    try {
      const response = await chatService.sendMessage(
        selectedChat.participants.find((p) => p._id !== selectedChat.userId)?._id,
        messageContent,
        selectedChat._id
      );
      
      // Add new message to state
      setMessages([...messages, response.data]);

      // Update last message in chat list
      setChats(
        chats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, lastMessage: response.data, updatedAt: new Date() }
            : chat
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setNewMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    if (!window.confirm("Delete this conversation?")) return;

    try {
      await chatService.deleteChat(chatId);
      setChats(chats.filter((chat) => chat._id !== chatId));
      if (selectedChat?._id === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.participants?.find((p) => p._id !== chat.userId);
    return (
      otherParticipant?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-[Poppins]">
      <div className="flex h-screen">
        {/* Sidebar - Chat List */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate(-1)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-black text-slate-900">Messages</h1>
              <div className="w-8" />
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const otherParticipant = chat.participants?.find(
                  (p) => p._id !== chat.userId
                );
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => setSelectedChat({ ...chat, userId: chat.participants[0]._id === chat.userId ? chat.participants[0]._id : chat.participants[1]._id })}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-50 border-indigo-200"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 truncate">
                          {otherParticipant?.name || "Unknown"}
                        </h3>
                        <p className="text-sm text-slate-500 truncate">
                          {chat.lastMessage?.content || "No messages yet"}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {chat.lastMessage?.createdAt
                            ? new Date(chat.lastMessage.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chat._id);
                          }}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageSquare size={40} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-bold">No conversations</p>
                <p className="text-slate-400 text-sm mt-1">
                  {searchQuery ? "No matching chats" : "Start a conversation"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        {selectedChat ? (
          <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  {selectedChat.participants?.[0]?.name?.[0] || "U"}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    {selectedChat.participants?.find((p) => p._id !== selectedChat.userId)?.name || "User"}
                  </h2>
                  <p className="text-xs text-slate-400">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender._id === selectedChat.userId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl ${
                        msg.sender._id === selectedChat.userId
                          ? "bg-indigo-600 text-white rounded-br-none"
                          : "bg-white border border-slate-200 text-slate-900 rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender._id === selectedChat.userId
                            ? "text-indigo-200"
                            : "text-slate-400"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <MessageSquare size={40} className="text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-bold">Start the conversation</p>
                    <p className="text-slate-400 text-sm">Send a message to begin chatting</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={sending}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Send
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:w-2/3 lg:w-3/4 items-center justify-center bg-slate-50">
            <div className="text-center">
              <MessageSquare size={50} className="text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Select a conversation</h2>
              <p className="text-slate-500">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
