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
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ use env variable
          'HTTP-Referer': 'http://localhost:3000', // change to your website if you deploy
          'X-Title': 'My AI App',
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful AI assistant. Provide clear, concise, and helpful responses.',
            },
            ...messages,
          ],
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        const raw = await response.text();
        throw new Error(`API Error: ${response.status} - ${raw || 'Unknown error'}`);
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

  async sendMessage(userMessage: string, chatHistory: ChatMessage[]): Promise<string> {
    const apiMessages: ApiMessage[] = chatHistory
      .slice(-10)
      .map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

    apiMessages.push({
      role: 'user',
      content: userMessage,
    });

    return this.makeRequest(apiMessages);
  }
}

export const aiService = new AIService();
