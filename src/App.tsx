import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Power, Cpu, HardDrive, Zap } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ErrorMessage from './components/ErrorMessage';
import { aiService, type ChatMessage as ChatMessageType } from './services/aiService';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isBooted, setIsBooted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Boot sequence and welcome message
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooted(true);
      const welcomeMessage: ChatMessageType = {
        id: 'welcome',
        content: "SYSTEM INITIALIZED...\nAI CORE ONLINE\n\nWELCOME TO 70s AI TERMINAL\nREADY FOR INPUT\n\n> HOW MAY I ASSIST YOU TODAY?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 2000);

    return () => clearTimeout(bootTimer);
  }, []);

  const handleSendMessage = async (content: string) => {
    setError(null);
    
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await aiService.sendMessage(content, messages);
      
      const aiMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'SYSTEM ERROR - PLEASE RETRY';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    });
  };

  const handleRetryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.isUser);
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
    setError(null);
  };

  if (!isBooted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center crt-screen">
        <div className="text-center animate-power-on">
          <div className="mb-8">
            <Monitor size={64} className="mx-auto text-green-400 animate-terminal-flicker" />
          </div>
          <div className="boot-text terminal-text">
            INITIALIZING AI SYSTEM...<br/>
            LOADING NEURAL NETWORKS...<br/>
            CALIBRATING RESPONSE MATRIX...<br/>
            <span className="terminal-cursor">█</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black crt-screen retro-grid">
      {/* CRT Monitor Frame */}
      <div className="min-h-screen crt-curve" style={{ 
        background: 'radial-gradient(ellipse at center, #001100 0%, #000000 70%)',
        boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.8)'
      }}>
        
        {/* Terminal Header */}
        <header className="border-b-2 border-green-400 retro-panel">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <Monitor size={32} className="text-green-400 animate-terminal-flicker" />
                  <div>
                    <h1 className="text-2xl font-bold vintage-text terminal-text">70s AI</h1>
                    <p className="text-xs amber-text">ARTIFICIAL INTELLIGENCE TERMINAL v1.0 {process.env.OPENROUTER_API_KEY}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* System Status */}
                <div className="flex items-center gap-2 retro-panel px-3 py-2">
                  <Cpu size={16} className="text-amber-400" />
                  <span className="text-xs amber-text">CPU: ONLINE</span>
                </div>
                
                <div className="flex items-center gap-2 retro-panel px-3 py-2">
                  <HardDrive size={16} className="text-amber-400" />
                  <span className="text-xs amber-text">MEM: 64KB</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Power size={16} className="text-red-400" />
                  <div className="power-led active"></div>
                </div>
              </div>
            </div>
            
            {/* System Info Bar */}
            <div className="mt-3 pt-3 border-t border-green-400/30">
              <div className="flex items-center justify-between text-xs">
                <span className="terminal-text">SYSTEM STATUS: OPERATIONAL</span>
                <span className="amber-text">
                  {new Date().toLocaleString().toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto py-4"
          >
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="mb-6">
                    <Zap size={48} className="mx-auto text-green-400 animate-terminal-flicker" />
                  </div>
                  <h2 className="text-lg vintage-text terminal-text mb-2">AWAITING INPUT</h2>
                  <p className="text-sm amber-text">ENTER QUERY TO BEGIN SESSION</p>
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onCopy={(content) => handleCopyMessage(content, message.id)}
                isCopied={copiedMessageId === message.id}
              />
            ))}
            
            {isLoading && <TypingIndicator />}
            
            {error && (
              <ErrorMessage 
                message={error}
                onRetry={handleRetryLastMessage}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!!error}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
