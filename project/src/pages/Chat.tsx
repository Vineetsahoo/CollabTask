import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Search, Mic, Phone, Video, MoreVertical, 
         Check, CheckCheck, Menu, ArrowLeft, Smile, Image, File, 
         X, Monitor, Settings, User, Info, Star, Clock, Heart } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  type?: 'text' | 'voice' | 'file';
  fileUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  online: boolean;
}

const Chat = () => {
  const [conversations] = useState<Conversation[]>([
    {
      id: 'c1',
      name: 'Marketing Team',
      lastMessage: 'Let\'s discuss the campaign',
      time: '10:30 AM',
      online: true,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=256'
    },
    {
      id: 'c2',
      name: 'Saumye Singh',
      lastMessage: 'Thanks for the update',
      time: 'Yesterday',
      online: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256'
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState('c1');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    'c1': [
      {
        id: 'm1',
        sender: 'Marketing Team',
        content: 'Hey everyone, starting new campaign discussion',
        time: '10:30 AM',
      },
      {
        id: 'm2',
        sender: 'You',
        content: 'I\'ll prepare the materials',
        time: '10:32 AM',
        isMe: true
      }
    ],
    'c2': [
      {
        id: 'm3',
        sender: 'David Kim',
        content: 'Project update?',
        time: '09:30 AM'
      }
    ]
  });

  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState('recent');
  const [emojiSearchQuery, setEmojiSearchQuery] = useState('');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(['👍', '❤️', '😊', '👏', '🎉']);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showFileOptions, setShowFileOptions] = useState(false);
  const [inCall, setInCall] = useState<null | 'audio' | 'video'>(null);
  const [selectedReactionMessage, setSelectedReactionMessage] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const moreOptionsRef = useRef<HTMLDivElement>(null);
  const fileOptionsRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else {
        setShowSidebar(false);
      }
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current && 
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
      
      if (
        moreOptionsRef.current && 
        !moreOptionsRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(false);
      }
      
      if (
        fileOptionsRef.current && 
        !fileOptionsRef.current.contains(event.target as Node)
      ) {
        setShowFileOptions(false);
      }
      
      if (!((event.target as HTMLElement).closest('.message-reactions'))) {
        setShowReactions(false);
        setSelectedReactionMessage(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fakeReplies = {
    'c1': [
      "Great initiative! Let's move forward with this.",
      "When can we schedule the next meeting?",
      "I've prepared some mockups for review.",
      "The metrics from last campaign look promising!",
      "Should we involve the design team as well?"
    ],
    'c2': [
      "The project is on track.",
      "Can you share the latest documentation?",
      "I'll review it by end of day.",
      "Let's schedule a quick sync.",
      "Thanks for keeping me updated!"
    ]
  };

  const simulateTyping = (conversationId: string) => {
    setIsTyping(true);

    const typingDuration = Math.random() * 2000 + 1000;

    setTimeout(() => {
      const randomReply = fakeReplies[conversationId as keyof typeof fakeReplies][
        Math.floor(Math.random() * fakeReplies[conversationId as keyof typeof fakeReplies].length)
      ];

      const replyMsg: Message = {
        id: `m${Date.now()}`,
        sender: conversations.find(c => c.id === conversationId)?.name || '',
        content: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setMessages(prev => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), replyMsg]
      }));
      setIsTyping(false);
    }, typingDuration);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'You',
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
    }));

    setNewMessage('');
    
    setTimeout(() => {
      newMsg.status = 'delivered';
      setMessages(prev => ({ ...prev }));
    }, 1000);

    setTimeout(() => {
      newMsg.status = 'read';
      setMessages(prev => ({ ...prev }));
    }, 2000);

    setTimeout(() => {
      simulateTyping(selectedConversation);
    }, Math.random() * 2000 + 2000);
  };

  const handleFileUpload = () => {
    setShowFileOptions(prev => !prev);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      const newMsg: Message = {
        id: `m${Date.now()}`,
        sender: 'You',
        content: '🎤 Voice message',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'voice',
        status: 'sent'
      };
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
      }));
      toast.success('Voice message sent');
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleConversationSelect = (convId: string) => {
    setSelectedConversation(convId);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setInCall(type);
    const otherParty = conversations.find(c => c.id === selectedConversation)?.name;
    toast.success(`Starting ${type} call with ${otherParty}`, {
      icon: type === 'audio' ? '📞' : '📹',
      duration: 3000
    });
    
    setTimeout(() => {
      setInCall(null);
      toast.success(`${type === 'audio' ? 'Call' : 'Video call'} ended`, {
        duration: 2000
      });
    }, 5000);
  };
  
  const handleEndCall = () => {
    setInCall(null);
    toast.success('Call ended', {
      duration: 2000
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    
    setRecentEmojis(prev => {
      const filtered = prev.filter(e => e !== emoji);
      return [emoji, ...filtered].slice(0, 20);
    });
    
    try {
      localStorage.setItem('recentEmojis', JSON.stringify([emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20)));
    } catch (e) {
      console.error('Failed to save recent emojis', e);
    }
    
    if (isMobile) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    try {
      const storedEmojis = localStorage.getItem('recentEmojis');
      if (storedEmojis) {
        setRecentEmojis(JSON.parse(storedEmojis));
      }
    } catch (e) {
      console.error('Failed to load recent emojis', e);
    }
  }, []);

  const getFilteredEmojis = () => {
    if (!emojiSearchQuery) {
      return emojiCategories[emojiCategory as keyof typeof emojiCategories]?.emojis || [];
    }
    
    const query = emojiSearchQuery.toLowerCase();
    let results: string[] = [];
    
    Object.values(emojiCategories).forEach(category => {
      results = [...results, ...category.emojis.filter(emoji => 
        emoji.toLowerCase().includes(query) || 
        category.name.toLowerCase().includes(query)
      )];
    });
    
    return [...new Set(results)];
  };

  const EnhancedEmojiPicker = () => {
    const filteredEmojis = getFilteredEmojis();
    
    return (
      <div 
        ref={emojiPickerRef}
        className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg z-10 w-64 max-h-72 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search emojis..."
              className="w-full pl-8 pr-2 py-1 text-sm bg-gray-50 rounded-md border border-gray-200"
              value={emojiSearchQuery}
              onChange={(e) => setEmojiSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
            {emojiSearchQuery && (
              <button 
                className="absolute right-2 top-1.5 text-gray-400 hover:text-gray-600"
                onClick={() => setEmojiSearchQuery('')}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
        
        {!emojiSearchQuery && (
          <div className="flex border-b overflow-x-auto scrollbar-thin p-1 bg-gray-50">
            {Object.entries(emojiCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setEmojiCategory(key)}
                className={`p-1.5 rounded-md mx-1 flex-shrink-0 ${
                  emojiCategory === key ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'
                }`}
                title={category.name}
              >
                {category.icon}
              </button>
            ))}
          </div>
        )}
        
        <div className="overflow-y-auto p-1 flex-1 min-h-[200px]">
          {filteredEmojis.length > 0 ? (
            <div className="grid grid-cols-7 gap-1">
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={`emoji-${emoji}-${index}`}
                  className="p-2 text-xl hover:bg-gray-100 rounded"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No emojis found
            </div>
          )}
        </div>
        
        <div className="border-t p-1.5 bg-gray-50 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            {filteredEmojis.length} {filteredEmojis.length === 1 ? 'emoji' : 'emojis'}
          </div>
          <button 
            className="text-xs text-blue-500 hover:underline"
            onClick={() => setShowEmojiPicker(false)}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const emojiCategories = {
    recent: {
      name: 'Recent',
      icon: <Clock className="h-4 w-4" />,
      emojis: recentEmojis
    },
    smileys: {
      name: 'Smileys',
      icon: <Smile className="h-4 w-4" />,
      emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '😊', '😇', '🥰', '😍', '😘', '😚', '😋', '😛', '😜', '😝', '🤑', '🤗', '🤭']
    },
    reactions: {
      name: 'Reactions',
      icon: <Heart className="h-4 w-4" />,
      emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤙', '👏', '🙌', '👐', '🤲', '🙏', '💪', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤']
    },
    objects: {
      name: 'Objects',
      icon: <File className="h-4 w-4" />,
      emojis: ['📱', '💻', '🖥️', '📷', '📹', '📼', '🔋', '🔌', '📡', '🔦', '🏮', '📚', '📖', '📜', '📄', '📃', '📑', '🔍', '🔎', '🔒', '🔓', '🔑', '🔨']
    }
  };

  const handleMoreOptions = (option: string) => {
    const actions: {[key: string]: () => void} = {
      'mute': () => toast.success('Conversation muted'),
      'block': () => toast.success('User blocked'),
      'clear': () => {
        setMessages(prev => ({
          ...prev,
          [selectedConversation]: []
        }));
        toast.success('Conversation cleared');
      },
      'delete': () => {
        toast.success('Conversation deleted');
      },
      'settings': () => toast.success('Chat settings opened'),
      'info': () => toast.success('Conversation info'),
      'star': () => toast.success('Conversation starred')
    };
    
    if (actions[option]) {
      actions[option]();
    }
    setShowMoreOptions(false);
  };

  const handleFileOption = (type: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (type === 'image') {
      input.accept = 'image/*';
    } else if (type === 'document') {
      input.accept = '.pdf,.doc,.docx,.txt';
    }
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(1) + ' KB';
      
      const newMsg: Message = {
        id: `m${Date.now()}`,
        sender: 'You',
        content: type === 'image' ? `📷 Image: ${fileName}` : `📄 File: ${fileName} (${fileSize})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent',
        type: 'file',
        fileUrl: URL.createObjectURL(file)
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), newMsg]
      }));
      
      toast.success(`${type === 'image' ? 'Image' : 'File'} sent: ${fileName}`);
    };
    
    input.click();
    setShowFileOptions(false);
  };

  const handleAddReaction = (messageId: string, reaction: string) => {
    setMessages(prev => {
      const updatedConversation = prev[selectedConversation].map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), reaction]
          };
        }
        return msg;
      });
      
      return {
        ...prev,
        [selectedConversation]: updatedConversation
      };
    });
    
    setShowReactions(false);
    setSelectedReactionMessage(null);
  };

  const toggleMessageReactions = (messageId: string) => {
    if (selectedReactionMessage === messageId && showReactions) {
      setShowReactions(false);
      setSelectedReactionMessage(null);
    } else {
      setSelectedReactionMessage(messageId);
      setShowReactions(true);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className={`${showSidebar ? 'block' : 'hidden'} 
                     md:block w-full md:w-80 bg-white border-r 
                     absolute md:relative z-10 h-full`}>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conv.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleConversationSelect(conv.id)}
            >
              <div className="flex items-center">
                <img
                  src={conv.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <div className="font-medium">{conv.name}</div>
                  <div className="text-sm text-gray-500">{conv.lastMessage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <button 
                  onClick={toggleSidebar} 
                  className="p-2 mr-2 hover:bg-gray-100 rounded-full"
                >
                  {showSidebar ? <ArrowLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              )}
              <img
                src={conversations.find(c => c.id === selectedConversation)?.avatar}
                alt=""
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-3">
                <div className="font-medium">
                  {conversations.find(c => c.id === selectedConversation)?.name}
                </div>
                {isTyping && <div className="text-sm text-gray-500">typing...</div>}
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className={`p-2 ${inCall === 'audio' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'} rounded-full`}
                onClick={() => inCall === 'audio' ? handleEndCall() : handleStartCall('audio')}
                title={inCall === 'audio' ? 'End call' : 'Start voice call'}
              >
                <Phone className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                className={`hidden md:block p-2 ${inCall === 'video' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-100'} rounded-full`}
                onClick={() => inCall === 'video' ? handleEndCall() : handleStartCall('video')}
                title={inCall === 'video' ? 'End video call' : 'Start video call'}
              >
                <Video className="h-5 w-5 text-gray-600" />
              </button>
              <div className="relative">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  title="More options"
                >
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
                
                {showMoreOptions && (
                  <div 
                    ref={moreOptionsRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                  >
                    <div className="py-1">
                      <button 
                        onClick={() => handleMoreOptions('info')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Info className="h-4 w-4 mr-2" /> View Info
                      </button>
                      <button 
                        onClick={() => handleMoreOptions('star')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Star className="h-4 w-4 mr-2" /> Star Conversation
                      </button>
                      <button 
                        onClick={() => handleMoreOptions('mute')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Monitor className="h-4 w-4 mr-2" /> Mute Notifications
                      </button>
                      <button 
                        onClick={() => handleMoreOptions('settings')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" /> Chat Settings
                      </button>
                      <div className="border-t border-gray-100"></div>
                      <button 
                        onClick={() => handleMoreOptions('clear')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-orange-600 flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" /> Clear Chat
                      </button>
                      <button 
                        onClick={() => handleMoreOptions('block')}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center"
                      >
                        <User className="h-4 w-4 mr-2" /> Block User
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-2 md:p-4 overflow-y-auto bg-gray-50">
          {inCall && (
            <div className="bg-blue-50 text-blue-800 p-2 rounded-lg mb-4 flex items-center justify-between">
              <div className="flex items-center">
                {inCall === 'audio' ? <Phone className="h-4 w-4 mr-2" /> : <Video className="h-4 w-4 mr-2" />}
                <span className="text-sm">
                  {inCall === 'audio' ? 'Call in progress' : 'Video call in progress'}
                </span>
              </div>
              <button 
                className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                onClick={handleEndCall}
              >
                End
              </button>
            </div>
          )}
          
          {messages[selectedConversation]?.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${message.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] md:max-w-xs rounded-lg px-3 py-2 ${
                  message.isMe ? 'bg-blue-500 text-white' : 'bg-white'
                } relative`}
                onDoubleClick={() => message.isMe ? null : toggleMessageReactions(message.id)}
              >
                <div className="text-sm">
                  {message.type === 'voice' ? (
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4" />
                      <div className="w-24 md:w-32 h-1 bg-gray-200 rounded" />
                    </div>
                  ) : message.type === 'file' && message.fileUrl ? (
                    <a 
                      href={message.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 underline"
                    >
                      {message.content.includes('Image') ? (
                        <Image className="h-4 w-4" />
                      ) : (
                        <File className="h-4 w-4" />
                      )}
                      {message.content}
                    </a>
                  ) : (
                    message.content
                  )}
                </div>
                <div className="text-xs mt-1 opacity-75 flex items-center gap-1">
                  {message.time}
                  {message.isMe && (
                    message.status === 'read' ? <CheckCheck className="h-3 w-3" /> :
                    message.status === 'delivered' ? <Check className="h-3 w-3" /> :
                    <Check className="h-3 w-3 opacity-50" />
                  )}
                </div>
                {message.reactions && message.reactions.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {message.reactions.map((reaction, i) => (
                      <span key={i} className="text-xs">{reaction}</span>
                    ))}
                  </div>
                )}
                
                {selectedReactionMessage === message.id && showReactions && !message.isMe && (
                  <div 
                    className="absolute bottom-full mb-2 bg-white shadow-lg rounded-full px-2 py-1 flex message-reactions"
                  >
                    {['👍', '❤️', '😂', '😮', '😢', '👏'].map((emoji) => (
                      <button
                        key={emoji}
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => handleAddReaction(message.id, emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 md:p-4 bg-white border-t">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-full cursor-pointer"
                onClick={handleFileUpload}
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              
              {showFileOptions && (
                <div 
                  ref={fileOptionsRef}
                  className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg z-10"
                >
                  <div className="p-2">
                    <button
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg w-full text-left"
                      onClick={() => handleFileOption('image')}
                    >
                      <Image className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="text-sm">Image</span>
                    </button>
                    <button
                      className="flex items-center p-2 hover:bg-gray-100 rounded-lg w-full text-left"
                      onClick={() => handleFileOption('document')}
                    >
                      <File className="h-4 w-4 mr-2 text-orange-500" />
                      <span className="text-sm">Document</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                className={`p-2 hover:bg-gray-100 rounded-full cursor-pointer ${showEmojiPicker ? 'bg-gray-100 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Add emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
              
              {showEmojiPicker && <EnhancedEmojiPicker />}
            </div>
            
            <button
              className={`p-2 hover:bg-gray-100 rounded-full ${isRecording ? 'text-red-500' : 'text-gray-500'}`}
              onClick={handleVoiceRecord}
            >
              <Mic className="h-5 w-5" />
            </button>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 p-2 border rounded-lg text-sm md:text-base"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;