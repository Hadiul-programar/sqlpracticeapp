import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Loader2, Lightbulb } from 'lucide-react';

interface AiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialError?: string;
  questionTitle?: string;
}

export const AiTutorModal: React.FC<AiTutorModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialError = '',
  questionTitle = '',
}) => {
  const [messages, setMessages] = useState<
    { role: 'tutor' | 'user'; text: string }[]
  >([
    {
      role: 'tutor',
      text: 'হ্যালো! আমি আপনার বাংলা এআই এসকিউএল টিউটর 🤖। যেকোনো কোয়েরি বা ত্রুটির ব্যাখ্যা জানতে আমাকে লিখে পাঠান!',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && (initialError || initialQuery)) {
      handleAutoExplain(initialQuery, initialError, questionTitle);
    }
  }, [isOpen, initialError, initialQuery]);

  if (!isOpen) return null;

  const handleAutoExplain = async (query: string, error?: string, question?: string) => {
    setIsLoading(true);
    const userPrompt = error
      ? `ত্রুটির ব্যাখ্যা চাওয়া হয়েছে: "${error}"`
      : `কোয়েরির ব্যাখ্যা চাওয়া হয়েছে: "${query}"`;

    setMessages((prev) => [...prev, { role: 'user', text: userPrompt }]);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          error,
          question,
          context: error ? 'error_explain' : 'explain_query',
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setMessages((prev) => [...prev, { role: 'tutor', text: data.explanation }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { role: 'tutor', text: '⚠️ ' + data.error }]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'tutor', text: '❌ এআই এর সাথে সংযোগে সমস্যা হয়েছে।' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          question: questionTitle,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setMessages((prev) => [...prev, { role: 'tutor', text: data.explanation }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'tutor', text: data.error || 'উত্তর পাওয়া যায়নি।' },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: 'tutor', text: '❌ সার্ভারে যোগাযোগ করা সম্ভব হয়নি।' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col h-[520px] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">বাংলা এআই এসকিউএল টিউটর</h3>
              <p className="text-[11px] text-slate-400">Gemini AI চালিত স্মার্ট অ্যাসিস্ট্যান্ট</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs sm:text-sm">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'tutor' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-cyan-500 text-slate-950 font-semibold rounded-tr-none'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none'
                }`}
              >
                {m.text}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-slate-950 p-3 rounded-xl border border-slate-800 w-max">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>এআই আপনার প্রশ্নের উত্তর চিন্তা করছে...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="আপনার প্রশ্ন বা সমস্যা লিখুন (যেমন: GROUP BY কিভাবে কাজ করে?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-900 border border-slate-800 text-slate-200 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-2.5 rounded-xl font-bold disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
