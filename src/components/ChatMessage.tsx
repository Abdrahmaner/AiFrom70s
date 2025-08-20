import React from 'react';
import { Monitor, User, Copy, Check, ChevronRight } from 'lucide-react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
  };
  onCopy: (content: string) => void;
  isCopied: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onCopy, isCopied }) => {
  return (
    <div className="px-6 py-3 animate-retro-slide">
      <div className={`flex gap-4 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Terminal Prompt */}
        <div className="flex-shrink-0 flex items-start pt-1">
          <div className={`flex items-center gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {message.isUser ? (
              <>
                <span className="text-xs amber-text vintage-text">USER  </span>
                <User size={16} className="text-amber-400" />
              </>
            ) : (
              <>
                <Monitor size={16} className="text-green-400 animate-terminal-flicker" />
                <span className="text-xs terminal-text vintage-text">AI</span>
              </>
            )}
            <ChevronRight size={12} className={message.isUser ? 'text-amber-400' : 'text-green-400'} />
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className={`retro-panel p-4 relative group ${
            message.isUser 
              ? 'border-amber-400/50' 
              : 'border-green-400/50'
          }`}>
            <pre className={`text-sm leading-relaxed whitespace-pre-wrap font-mono ${
              message.isUser ? 'amber-text' : 'terminal-text'
            }`}>
              {message.content}
            </pre>
            
            {/* Copy Button */}
            {!message.isUser && (
              <button
                onClick={() => onCopy(message.content)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 retro-button px-2 py-1 text-xs"
              >
                {isCopied ? (
                  <Check size={12} className="text-green-400" />
                ) : (
                  <Copy size={12} className="text-green-400" />
                )}
              </button>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`mt-2 text-xs flex items-center gap-2 ${
            message.isUser ? 'justify-end' : 'justify-start'
          }`}>
            <div className="status-dot"></div>
            <span className="text-green-400/70 font-mono">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
