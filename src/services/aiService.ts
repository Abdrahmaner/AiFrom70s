
// ✅ Use your own secure API endpoint instead
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private async makeRequest(messages: ApiMessage[]): Promise<string> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✅ No Authorization header - your API route handles security
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  async sendMessage(
    userMessage: string,
    chatHistory: ChatMessage[]
  ): Promise<string> {
    // Convert chat history to API format
    const apiMessages: ApiMessage[] = chatHistory
      .slice(-10) // Keep only last 10 messages for context
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

    // Add the current user message
    apiMessages.push({
      role: 'user',
      content: userMessage,
    });

    return this.makeRequest(apiMessages);
  }
}

export const aiService = new AIService();
