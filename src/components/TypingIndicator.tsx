import React from 'react';
import { Monitor, Cpu, Activity } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="px-6 py-3 animate-retro-slide">
      <div className="flex gap-4">
        {/* Terminal Prompt */}
        <div className="flex-shrink-0 flex items-start pt-1">
          <div className="flex items-center gap-2">
            <Monitor size={16} className="text-green-400 animate-terminal-flicker" />
            <span className="text-xs terminal-text vintage-text">AI</span>
            <Activity size={12} className="text-green-400 animate-pulse" />
          </div>
        </div>

        {/* Processing Animation */}
        <div className="flex-1">
          <div className="retro-panel border-green-400/50 p-4">
            <div className="flex items-center gap-3">
              <Cpu size={16} className="text-amber-400 animate-pulse" />
              <span className="text-sm terminal-text vintage-text">PROCESSING</span>
              
              {/* Retro loading dots */}
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-400 animate-terminal-flicker" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-400 animate-terminal-flicker" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-green-400 animate-terminal-flicker" style={{ animationDelay: '400ms' }}></div>
              </div>
              
              <span className="terminal-cursor text-green-400">█</span>
            </div>
            
            {/* Processing status */}
            <div className="mt-2 text-xs text-green-400/70 font-mono">
              NEURAL NETWORK ACTIVE...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;