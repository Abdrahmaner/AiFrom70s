import React from 'react';
import { Monitor, AlertTriangle, RotateCcw, Zap } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="px-6 py-3 animate-retro-slide">
      <div className="flex gap-4">
        {/* Terminal Prompt */}
        <div className="flex-shrink-0 flex items-start pt-1">
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-red-400 animate-terminal-flicker" />
            <span className="text-xs text-red-400 vintage-text font-mono">ERR</span>
            <AlertTriangle size={12} className="text-red-400" />
          </div>
        </div>

        {/* Error Content */}
        <div className="flex-1">
          <div className="retro-panel border-red-400/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-red-400" />
              <span className="text-sm text-red-400 vintage-text font-mono">SYSTEM ERROR</span>
            </div>
            
            <pre className="text-sm text-red-300 font-mono leading-relaxed mb-3">
              {message.toUpperCase()}
            </pre>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="retro-button border-red-400 text-red-400 hover:border-red-300 hover:text-red-300 px-3 py-2 text-xs flex items-center gap-2"
              >
                <RotateCcw size={12} />
                RETRY
              </button>
            )}
          </div>
          
          {/* Error timestamp */}
          <div className="mt-2 text-xs flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-red-400 animate-terminal-flicker"></div>
            <span className="text-red-400/70 font-mono">
              ERROR LOG:{process.env.OPENROUTER_API_KEY}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
