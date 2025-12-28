import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Menu, 
  Smile, 
  Image,
  X,
  Users,
  Hash,
  Plus,
  Settings,
  Star,
  Reply
} from 'lucide-react';
import { toast } from 'sonner';
import { mockChannels, mockMessages, mockUsers } from '../data/mockData';
import type { ChatChannel, ChatMessage, User } from '../types';

const ModernChat: React.FC = () => {
  const [channels] = useState<ChatChannel[]>(mockChannels);
  const [selectedChannel, setSelectedChannel] = useState<string>(mockChannels[0]?.id || '');
  const [messages, setMessages] = useState<{ [key: string]: ChatMessage[] }>({
    [mockChannels[0]?.id || '']: mockMessages
  });
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping] = useState(false);
  const [onlineUsers] = useState<User[]>(mockUsers.filter(u => u.status === 'online'));
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // Responsive handling
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      content: newMessage,
      sender: mockUsers[0], // Current user
      timestamp: new Date(),
      type: 'text',
      replyTo: replyingTo?.id,
      reactions: [],
      mentions: [],
      attachments: []
    };

    setMessages(prev => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), message]
    }));

    setNewMessage('');
    setReplyingTo(null);
    toast.success('Message sent');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date(timestamp));
  };

  const currentChannel = channels.find(c => c.id === selectedChannel);
  const currentMessages = messages[selectedChannel] || [];

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar - Messages List */}
      {(showSidebar || !isMobile) && (
        <div className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : ''
        } w-80 bg-white border-r border-neutral-200 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-blue-600">Messages</h2>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                  <Plus className="h-5 w-5 text-neutral-500" />
                </button>
                <button className="p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                  <Search className="h-5 w-5 text-neutral-500" />
                </button>
                {isMobile && (
                  <button 
                    onClick={() => setShowSidebar(false)}
                    className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-neutral-500" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Online Now Section */}
          <div className="px-6 py-4 border-b border-neutral-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-neutral-500">Online Now</h3>
              <button className="text-xs text-blue-600 font-medium hover:text-blue-700">See All</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {onlineUsers.slice(0, 8).map(user => (
                <div key={user.id} className="flex-shrink-0">
                  <div className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-12 w-12 rounded-full ring-2 ring-white"
                    />
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pinned Message */}
          <div className="px-6 py-3">
            <div className="flex items-center gap-2 text-neutral-400 mb-2">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-xs font-medium">Pinned Message</span>
            </div>
          </div>

          {/* All Messages List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-3">
              <div className="flex items-center gap-2 px-3 py-2 text-neutral-400 mb-2">
                <div className="h-px flex-1 bg-neutral-200"></div>
                <span className="text-xs font-medium">All Message</span>
                <div className="h-px flex-1 bg-neutral-200"></div>
              </div>
              
              {channels.map(channel => {
                const lastMessage = messages[channel.id]?.[messages[channel.id].length - 1];
                const isActive = selectedChannel === channel.id;
                
                return (
                  <button
                    key={channel.id}
                    onClick={() => {
                      setSelectedChannel(channel.id);
                      if (isMobile) setShowSidebar(false);
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={channel.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                        alt={channel.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      {channel.type === 'direct' && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-neutral-900 text-sm truncate">{channel.name}</h4>
                        <span className="text-xs text-neutral-400 ml-2 flex-shrink-0">
                          {lastMessage ? formatTime(lastMessage.timestamp) : '08:40 AM'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-neutral-500 truncate pr-2">
                          {lastMessage?.content || channel.description || 'No messages yet'}
                        </p>
                        {channel.unreadCount && channel.unreadCount > 0 && (
                          <span className="flex-shrink-0 bg-red-500 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
                            {channel.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-50">
        {/* Chat Header */}
        <div className="bg-white border-b border-neutral-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5 text-neutral-500" />
                </button>
              )}
              
              <div className="flex items-center gap-3">
                {currentChannel?.type === 'direct' ? (
                  <img 
                    src={currentChannel?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                    alt={currentChannel?.name}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                )}
                
                <div>
                  <h1 className="font-semibold text-neutral-900 text-lg">{currentChannel?.name}</h1>
                  <p className="text-sm text-neutral-500">
                    {currentChannel?.members?.length || 12} Member, {onlineUsers.length} Online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2.5 hover:bg-neutral-50 rounded-lg transition-colors" title="Voice Call">
                <Phone className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2.5 hover:bg-neutral-50 rounded-lg transition-colors" title="Video Call">
                <Video className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2.5 hover:bg-neutral-50 rounded-lg transition-colors" title="More Options">
                <MoreVertical className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Date Separator */}
          <div className="flex items-center justify-center">
            <div className="px-4 py-1.5 bg-white rounded-full text-xs font-medium text-neutral-500 shadow-sm border border-neutral-100">
              Today
            </div>
          </div>

          {currentMessages.map((message, index) => {
            const isCurrentUser = message.sender.id === mockUsers[0].id;
            const showAvatar = index === 0 || currentMessages[index - 1].sender.id !== message.sender.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-3"
              >
                <div className="flex-shrink-0">
                  {showAvatar ? (
                    <img
                      src={message.sender.avatar}
                      alt={message.sender.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10" />
                  )}
                </div>
                
                <div className="flex-1 max-w-2xl">
                  {showAvatar && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-neutral-900">{message.sender.name}</span>
                      <span className="text-xs text-neutral-400">{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  
                  <div className="group relative">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-neutral-100 inline-block">
                      {message.replyTo && (
                        <div className="mb-2 p-2 bg-neutral-50 rounded-lg border-l-2 border-blue-600">
                          <p className="text-xs text-neutral-500">Replying to previous message</p>
                        </div>
                      )}
                      
                      <p className="text-sm text-neutral-700 leading-relaxed">{message.content}</p>
                    </div>
                    
                    {/* Reactions */}
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {message.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs border border-neutral-200 hover:border-blue-300 transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-neutral-600">{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-neutral-200 rounded-full animate-pulse"></div>
              <div className="flex items-center gap-1 bg-white rounded-2xl px-4 py-3 shadow-sm border border-neutral-100">
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="h-2 w-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Bar */}
        {replyingTo && (
          <div className="px-6 py-3 bg-white border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  Replying to <strong>{replyingTo.sender.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-neutral-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 truncate mt-1 ml-6">{replyingTo.content}</p>
          </div>
        )}

        {/* Message Input */}
        <div className="px-6 py-4 bg-white border-t border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center bg-neutral-50 rounded-2xl px-5 py-3 border border-neutral-200 focus-within:border-blue-500 focus-within:bg-white transition-all">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type message"
                  className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-neutral-700 placeholder:text-neutral-400"
                />
                
                <div className="flex items-center gap-2 ml-3">
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1 hover:bg-neutral-200 rounded-lg transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="h-5 w-5 text-neutral-400" />
                  </button>
                  <button className="p-1 hover:bg-neutral-200 rounded-lg transition-colors" title="Attach file">
                    <Paperclip className="h-5 w-5 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernChat;
