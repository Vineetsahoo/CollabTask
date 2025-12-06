import React, { useState, useEffect, useRef } from 'react';
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
    <div className="flex h-full bg-neutral-50">
      {/* Sidebar - Always visible on desktop */}
      {(showSidebar || !isMobile) && (
        <div className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : ''
        } w-80 bg-white border-r border-neutral-200 flex flex-col shadow-sm`}>
          {/* Sidebar Header */}
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900">Chat</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Plus className="h-4 w-4 text-neutral-500" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Settings className="h-4 w-4 text-neutral-500" />
                  </button>
                  {isMobile && (
                    <button 
                      onClick={() => setShowSidebar(false)}
                      className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-neutral-500" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-neutral-50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              </div>
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-2 mb-2">
                    Channels
                  </h3>
                  {filteredChannels.filter(c => c.type !== 'direct').map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannel(channel.id);
                        if (isMobile) setShowSidebar(false);
                      }}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        selectedChannel === channel.id
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <Hash className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{channel.name}</span>
                      {channel.unreadCount && channel.unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                
                <div className="mb-4">
                  <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-2 mb-2">
                    Direct Messages
                  </h3>
                  {filteredChannels.filter(c => c.type === 'direct').map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        setSelectedChannel(channel.id);
                        if (isMobile) setShowSidebar(false);
                      }}
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        selectedChannel === channel.id
                          ? 'bg-brand-50 text-brand-700 font-medium'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="relative mr-2 flex-shrink-0">
                        <img 
                          src={channel.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                          alt={channel.name}
                          className="h-6 w-6 rounded-full"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
                      </div>
                      <span className="truncate">{channel.name}</span>
                      {channel.unreadCount && channel.unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                          {channel.unreadCount}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Online Users */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50">
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">
                Online ({onlineUsers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {onlineUsers.slice(0, 8).map(user => (
                  <div key={user.id} className="relative">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full ring-2 ring-white"
                      title={user.name}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success-500 border-2 border-white rounded-full"></div>
                  </div>
                ))}
                {onlineUsers.length > 8 && (
                  <div className="h-8 w-8 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-medium text-neutral-700">
                    +{onlineUsers.length - 8}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMobile && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-500" />
                </button>
              )}
              
              {currentChannel?.type === 'direct' ? (
                <img 
                  src={currentChannel?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                  alt={currentChannel?.name}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                  <Hash className="h-5 w-5 text-neutral-600" />
                </div>
              )}
              
              <div>
                <h1 className="font-semibold text-neutral-900">{currentChannel?.name}</h1>
                {currentChannel?.description && (
                  <p className="text-sm text-neutral-600">{currentChannel.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Voice Call">
                <Phone className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Video Call">
                <Video className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="Members">
                <Users className="h-5 w-5 text-neutral-600" />
              </button>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors" title="More Options">
                <MoreVertical className="h-5 w-5 text-neutral-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-neutral-50">
          {currentMessages.map((message, index) => {
            const isCurrentUser = message.sender.id === mockUsers[0].id;
            const showAvatar = index === 0 || currentMessages[index - 1].sender.id !== message.sender.id;
            
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
              >
                {showAvatar && !isCurrentUser && (
                  <img
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    className="h-8 w-8 rounded-full flex-shrink-0"
                  />
                )}
                
                <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} ${!showAvatar && !isCurrentUser ? 'ml-11' : ''}`}>
                  {showAvatar && (
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-neutral-900">{message.sender.name}</span>
                      <span className="text-xs text-neutral-500">{formatTime(message.timestamp)}</span>
                    </div>
                  )}
                  
                  <div
                    className={`group relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      isCurrentUser
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
                    }`}
                  >
                    {message.replyTo && (
                      <div className="mb-2 p-2 bg-black/10 rounded-lg">
                        <p className="text-xs opacity-75">Replying to previous message</p>
                      </div>
                    )}
                    
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Message Actions */}
                    <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 shadow-sm">
                        <button
                          onClick={() => setReplyingTo(message)}
                          className="p-1 hover:bg-neutral-100 rounded transition-colors"
                          title="Reply"
                        >
                          <Reply className="h-3 w-3 text-neutral-600" />
                        </button>
                        <button className="p-1 hover:bg-neutral-100 rounded transition-colors" title="Star">
                          <Star className="h-3 w-3 text-neutral-600" />
                        </button>
                        <button className="p-1 hover:bg-neutral-100 rounded transition-colors" title="More">
                          <MoreVertical className="h-3 w-3 text-neutral-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-neutral-200 rounded-full flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="h-1 w-1 bg-neutral-500 rounded-full animate-bounce"></div>
                  <div className="h-1 w-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-1 w-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <span className="text-sm text-neutral-500">Someone is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Bar */}
        {replyingTo && (
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Reply className="h-4 w-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">
                  Replying to <strong>{replyingTo.sender.name}</strong>
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="p-1 hover:bg-neutral-200 rounded transition-colors"
              >
                <X className="h-4 w-4 text-neutral-500" />
              </button>
            </div>
            <p className="text-sm text-neutral-500 truncate mt-1">{replyingTo.content}</p>
          </div>
        )}

        {/* Message Input */}
        <div className="px-4 py-3 bg-white border-t border-neutral-200">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="flex items-center bg-neutral-50 rounded-xl px-4 py-2.5 border border-neutral-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentChannel?.name || 'channel'}...`}
                  className="flex-1 bg-transparent border-0 focus:outline-none text-sm placeholder:text-neutral-400"
                />
                
                <div className="flex items-center gap-1 ml-2">
                  <button className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors" title="Attach file">
                    <Paperclip className="h-4 w-4 text-neutral-500" />
                  </button>
                  <button className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors" title="Add image">
                    <Image className="h-4 w-4 text-neutral-500" />
                  </button>
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-1.5 hover:bg-neutral-200 rounded-lg transition-colors"
                    title="Add emoji"
                  >
                    <Smile className="h-4 w-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
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
