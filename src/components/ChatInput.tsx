import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Zap } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  return (
    <div className="border-t-2 border-green-400 retro-panel">
      <div className="max-w-6xl mx-auto p-4">
        {/* Terminal Status Line */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="terminal-text vintage-text">INPUT MODE: ACTIVE</span>
            <div className="flex items-center gap-1">
              <div className="status-dot"></div>
              <span className="text-green-400/70 font-mono">READY</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-amber-400" />
            <span className="amber-text font-mono">PWR: ON</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            {/* Terminal Prompt */}
            <div className="absolute left-3 top-3 terminal-text text-sm font-bold">
              &gt;
            </div>
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ENTER COMMAND..."
              disabled={disabled || isLoading}
              className="w-full terminal-input pl-8 pr-4 py-3 text-sm resize-none retro-focus vintage-text"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            
            {/* Cursor indicator */}
            {message && (
              <div className="absolute bottom-3 right-3">
                <span className="terminal-text terminal-cursor text-sm">█</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className="retro-button px-4 py-3 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed vintage-text text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                PROC
              </>
            ) : (
              <>
                <Send size={16} />
                SEND
              </>
            )}
          </button>
        </form>
        
        {/* Command Help */}
        <div className="mt-3 text-center">
          <p className="text-xs text-green-400/50 font-mono">
            PRESS <span className="retro-panel px-1 border border-green-400/30 text-green-400">ENTER</span> TO EXECUTE • 
            <span className="retro-panel px-1 border border-green-400/30 text-green-400 ml-1">SHIFT+ENTER</span> FOR NEW LINE
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;