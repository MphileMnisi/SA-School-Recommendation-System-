import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { sendMessageToBot } from '../services/geminiService';
import { BotIcon } from './icons/BotIcon';

interface ChatbotProps {
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I'm your career guidance counselor. How can I help you today? You can ask me about careers, subjects, or universities in South Africa.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBot(input.trim());
      const modelMessage: ChatMessage = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'error',
        content: error instanceof Error ? error.message : 'Sorry, something went wrong.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm h-[60vh] flex flex-col z-30">
        <div className="bg-white dark:bg-gray-800 rounded-t-lg shadow-xl flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Career Counselor Bot</h3>
            <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
            {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                        <BotIcon className="w-5 h-5" />
                    </div>
                )}
                <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' :
                    msg.role === 'model' ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm' :
                    'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-bl-none'
                }`}>
                <div className="text-sm break-words space-y-2">
                  {msg.content.split('\n').filter(p => p.trim() !== '').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                </div>
            </div>
            ))}
            {isLoading && (
                 <div className="flex items-end gap-2 justify-start">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
                        <BotIcon className="w-5 h-5" />
                    </div>
                    <div className="max-w-xs md:max-w-sm rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm">
                        <div className="flex items-center justify-center gap-1">
                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
        <div className="border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-xl">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                disabled={isLoading}
            />
            <button type="submit" className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800" disabled={isLoading || !input.trim()} aria-label="Send message">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
            </button>
            </form>
        </div>
    </div>
  );
};

export default Chatbot;