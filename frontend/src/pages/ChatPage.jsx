import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  ArrowLeft,
  Trash2,
  Loader2,
  MessageSquare,
  Search,
  MoreHorizontal,
  Navigation,
  Clock,
  Check,
  CheckCheck
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
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
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
      
      setMessages([...messages, response.data]);

      setChats(
        chats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, lastMessage: response.data, updatedAt: new Date() }
            : chat
        )
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setNewMessage(messageContent); 
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

  const openChat = (chat) => {
    setSelectedChat({
      ...chat,
      userId:
        chat.participants[0]._id === chat.userId
          ? chat.participants[0]._id
          : chat.participants[1]._id,
    });
    setIsMobileChatOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pastel-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="animate-spin text-pastel-lavender-dark mx-auto" size={40} strokeWidth={3} />
          <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Opening Comm-Link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-cream font-[Poppins] relative overflow-hidden">
      {/* Background Blooms */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-pastel-mint-light/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-pastel-lavender-light/20 rounded-full blur-[120px]" />
      </div>

      <div className="flex h-[calc(100vh-4rem)] md:h-screen relative z-10 glass-morphism overflow-hidden">
        {/* Sidebar - Chat List */}
        <div className={`w-full md:w-1/3 lg:w-1/4 bg-white/40 backdrop-blur-xl border-r border-white/50 flex-col ${isMobileChatOpen ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="p-6 border-b border-white/40">
            <div className="flex items-center justify-between mb-8">
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Back to previous page"
                className="md:hidden p-3 bg-white/60 hover:bg-white rounded-2xl shadow-sm border border-white transition-all active:scale-95"
              >
                <ArrowLeft size={18} />
              </button>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Social Nexus</h1>
              <div className="w-4" />
            </div>

            {/* Search Hub */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-slate-400 group-focus-within:text-pastel-lavender-dark transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Find a contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white border-2 border-white rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-pastel-lavender-light/30 focus:border-pastel-lavender transition-all font-medium text-sm placeholder:text-slate-400 shadow-sm"
              />
            </div>
          </div>

          {/* Chat List Grid */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => {
                const otherParticipant = chat.participants?.find(
                  (p) => p._id !== chat.userId
                );
                const isSelected = selectedChat?._id === chat._id;

                return (
                  <div
                    key={chat._id}
                    onClick={() => openChat(chat)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openChat(chat);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Open chat with ${otherParticipant?.name || "Anonymous"}`}
                    className={`p-5 rounded-[2.5rem] cursor-pointer transition-all border-2 relative group/chat ${
                      isSelected
                        ? "bg-white border-pastel-lavender shadow-xl shadow-pastel-lavender/10"
                        : "bg-white/40 border-transparent hover:bg-white hover:border-white hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center text-white font-black text-xl shadow-lg transform transition-transform group-hover/chat:scale-110 ${
                        isSelected ? "bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender translate-x-1" : "bg-gradient-to-tr from-slate-400 to-slate-200"
                      }`}>
                        {otherParticipant?.name?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-black text-slate-800 truncate text-sm tracking-tight">
                            {otherParticipant?.name || "Anonymous"}
                          </h3>
                          <p className="text-[8px] font-black text-slate-400 uppercase tabular-nums tracking-widest">
                            {chat.lastMessage?.createdAt
                              ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : ""}
                          </p>
                        </div>
                        <p className={`text-xs truncate ${isSelected ? "text-slate-600 font-medium" : "text-slate-400"}`}>
                          {chat.lastMessage?.content || "Archive is empty"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                 <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-slate-300 shadow-inner border border-white">
                  <MessageSquare size={32} strokeWidth={1.5} />
                 </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Void Detected</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{searchQuery ? "No matching frequency" : "Initialize a link"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Interface Hub */}
        {selectedChat ? (
          <div className={`${isMobileChatOpen ? "flex" : "hidden"} md:flex w-full md:w-2/3 lg:w-3/4 flex-col bg-white/20 backdrop-blur-3xl`}>
            {/* Interface Header */}
            <div className="px-8 py-6 bg-white/40 border-b border-white border-l border-white/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setIsMobileChatOpen(false)}
                  aria-label="Close current chat"
                  className="md:hidden p-3 bg-white/60 hover:bg-white rounded-2xl shadow-sm border border-white transition-all active:scale-95"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="relative">
                  <div className="w-14 h-14 rounded-[1.75rem] bg-gradient-to-br from-pastel-mint-dark to-pastel-mint flex items-center justify-center text-white font-black text-xl shadow-xl border-4 border-white">
                    {selectedChat.participants?.find((p) => p._id !== selectedChat.userId)?.name?.[0] || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-pastel-mint-dark rounded-full border-4 border-white" />
                </div>
                <div>
                  <h2 className="font-black text-slate-800 text-xl tracking-tight">
                    {selectedChat.participants?.find((p) => p._id !== selectedChat.userId)?.name || "Pilot / Traveler"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pastel-mint-dark animate-pulse" />
                    <p className="text-[10px] font-black text-pastel-mint-dark uppercase tracking-widest">Active Link</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                 <button
                    type="button"
                    onClick={() => handleDeleteChat(selectedChat._id)}
                    aria-label="Delete selected conversation"
                    className="p-4 bg-white/60 text-slate-400 hover:text-pastel-pink-dark hover:bg-white rounded-2xl border border-white transition-all active:scale-90"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button type="button" aria-label="More conversation options" className="p-4 bg-white/60 text-slate-400 hover:text-pastel-lavender-dark hover:bg-white rounded-2xl border border-white transition-all active:scale-90">
                    <MoreHorizontal size={20} />
                  </button>
              </div>
            </div>

            {/* Matrix Area (Messages) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10 custom-scrollbar relative">
               <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              {loadingMessages ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="animate-spin text-pastel-lavender-dark" size={32} strokeWidth={3} />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decoding Stream...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => {
                  const isMine = msg.sender._id === selectedChat.userId || msg.sender === selectedChat.userId;
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isMine ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
                    >
                      <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] md:max-w-md`}>
                        <div
                          className={`px-8 py-5 rounded-[2rem] shadow-pastel-shadow text-sm font-medium relative group/msg transition-all ${
                            isMine
                              ? "bg-gradient-to-br from-pastel-lavender-dark to-pastel-lavender text-white rounded-tr-none hover:shadow-xl translate-x-1"
                              : "bg-white text-slate-800 rounded-tl-none border-2 border-white hover:border-pastel-mint translate-x-[-4px]"
                          }`}
                        >
                          <p className="leading-relaxed break-words">{msg.content}</p>
                          
                          <div className={`absolute bottom-[-18px] flex items-center gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity ${isMine ? "right-2" : "left-2"}`}>
                             <p className="text-[9px] font-black text-slate-400 tabular-nums uppercase tracking-widest">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                             {isMine && <CheckCheck size={12} className="text-pastel-mint-dark" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div className="bg-white/40 p-12 rounded-[3.5rem] border-2 border-white shadow-xl max-w-sm">
                    <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center text-pastel-lavender-dark mx-auto mb-6 shadow-sm">
                      <Send size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">Initialize Transmission</h3>
                    <p className="text-slate-500 text-xs font-medium mt-3 leading-relaxed italic">"Great connections start with a single packet."</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Port */}
            <div className="p-6 md:p-10 border-t border-white/50 bg-white/40">
              <div className="relative group/input max-w-5xl mx-auto flex gap-4">
                <input
                  type="text"
                  placeholder="Sync a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={sending}
                  aria-label="Type message"
                  className="flex-1 px-8 py-5 bg-white border-2 border-white rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-pastel-lavender-light/30 focus:border-pastel-lavender transition-all font-medium text-sm placeholder:text-slate-400 shadow-md text-slate-800 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  aria-label="Send message"
                  className="px-10 py-5 bg-slate-800 text-white rounded-[2rem] hover:bg-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 group/send"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={18} strokeWidth={2.5} className="group-hover/send:rotate-12 transition-transform" />
                      Broadcast
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex md:w-2/3 lg:w-3/4 items-center justify-center bg-white/20 backdrop-blur-md">
            <div className="text-center bg-white/40 p-20 rounded-[4rem] border-2 border-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-pastel-lavender-light/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000" />
              <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-inner border border-white">
                <MessageSquare size={44} strokeWidth={1} className="text-pastel-lavender" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Frequency Selector</h2>
              <p className="text-slate-500 font-medium mt-4 italic">Choose a link to begin the social transmission</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
