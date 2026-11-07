import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import { CopilotResponse } from '../../types';
import { 
  X, Send, Sparkles, Globe, UserCheck, ShieldCheck, 
  ExternalLink, ArrowRight, Bot, User, RefreshCw
} from 'lucide-react';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  citations?: any[];
  actionPills?: { label: string; route: string }[];
  timestamp: string;
}

export const AICopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose, onNavigate }) => {
  const { currentUser } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'copilot',
      text: "Hello! I am your ScholarEase AI Financial Aid Copilot. I analyze official government guidelines and rules for Telangana ePASS, NSP, and AICTE schemes. How can I help with your scholarship journey today?",
      timestamp: 'Just now',
      actionPills: [
        { label: 'Check Zero-Repeat-Visit', route: 'zeroVisit' },
        { label: 'Audit Document Consistency', route: 'documents' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const resp: CopilotResponse = await api.queryCopilot(
        text,
        language,
        currentUser?.id || 1
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: resp.answer,
        citations: resp.citations,
        actionPills: resp.action_pills,
        timestamp: 'Just now'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'copilot',
        text: "I encountered a network issue communicating with the guidelines engine. Please try again or verify directly with your college scholarship desk.",
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 bg-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm sm:text-base">AI Financial Aid Copilot</h3>
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">
                  RAG Active
                </span>
              </div>
              <p className="text-[11px] text-brand-200">Grounded in Telangana & National Government Orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Language Toggle */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-brand-800 text-brand-100 text-xs px-2 py-1 rounded border border-brand-700 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिन्दी</option>
            </select>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-brand-200 hover:text-white hover:bg-brand-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Profile Context Banner */}
        <div className="bg-brand-50 border-b border-brand-100 px-4 py-2 flex items-center justify-between text-xs text-brand-900">
          <label className="flex items-center gap-1.5 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={includeContext}
              onChange={(e) => setIncludeContext(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Using Verified Student Context ({currentUser?.full_name})</span>
          </label>
        </div>

        {/* Message Transcript Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'copilot' && (
                <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-700 text-white rounded-br-none shadow-xs'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/70'
              }`}>
                <div className="whitespace-pre-line">
                  {msg.text}
                </div>

                {/* Grounded Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Officially Verified Source
                    </span>
                    {msg.citations.map((c, i) => (
                      <a
                        key={i}
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white p-2 rounded-lg border border-slate-200 hover:border-brand-300 transition-colors text-[11px] text-brand-800"
                      >
                        <p className="font-semibold flex items-center justify-between">
                          <span>{c.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </p>
                        <p className="text-slate-500 text-[10px] mt-0.5">{c.clause}</p>
                      </a>
                    ))}
                  </div>
                )}

                {/* Action Pills */}
                {msg.actionPills && msg.actionPills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {msg.actionPills.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          onClose();
                          onNavigate(p.route);
                        }}
                        className="text-[11px] font-semibold bg-white text-brand-800 hover:bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-full transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>{p.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  {currentUser?.full_name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs py-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
              <span>Retrieving government orders and synthesizing response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Question Pills */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none flex gap-1.5">
          <button
            onClick={() => handleSend("Can Lateral Entry B.Tech students get full fee reimbursement?")}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 text-xs rounded-full border border-slate-200 transition-colors"
          >
            🎓 Lateral Entry RTF Eligibility
          </button>
          <button
            onClick={() => handleSend("లాటరల్ ఎంట్రీ విద్యార్థులకు ఫీజు రీయింబర్స్‌మెంట్ వర్తిస్తుందా?")}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 text-xs rounded-full border border-slate-200 transition-colors"
          >
            తెలుగు: ఫీజు రీయింబర్స్‌మెంట్
          </button>
          <button
            onClick={() => handleSend("What documents are required for ePASS physical verification?")}
            className="whitespace-nowrap px-2.5 py-1 bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-800 text-xs rounded-full border border-slate-200 transition-colors"
          >
            📋 Required Documents
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                language === 'te'
                  ? "మీ సందేహాన్ని ఇక్కడ అడగండి..."
                  : language === 'hi'
                  ? "अपना प्रश्न यहाँ पूछें..."
                  : "Ask about eligibility, documents, or rules..."
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="p-2.5 bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white rounded-xl transition-colors shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
