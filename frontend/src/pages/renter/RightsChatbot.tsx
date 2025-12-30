import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import AppHeader from '../../components/layout/AppHeader';
import { renterApi } from '../../lib/renterApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Loader2, Send, Bot, User, MessageSquare, ShieldCheck, MapPin, ArrowLeft } from 'lucide-react';
import { US_STATES } from '../../lib/constants';
import { useNavigate } from 'react-router-dom';

export default function RightsChatbotPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [state, setState] = useState('TX'); // Default to Texas
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get state label for display
  const stateLabel = US_STATES.find(s => s.value === state)?.label || state;

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage('');
    
    // Optimistic UI update
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date().toISOString() }]);
    
    setIsLoading(true);
    setIsTyping(true);

    try {
      const data = await renterApi.chat(userMsg, stateLabel);
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.response, timestamp: new Date().toISOString() }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting to my knowledge base. Please check your internet connection or try again later.",
        isError: true,
        timestamp: new Date().toISOString() 
      }]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <AppHeader />
      {/* Sticky Header */}
      <header className="bg-white dark:bg-slate-900 border-b p-4 z-10">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
        <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
           <div className="flex items-center gap-3">
             <div className="bg-blue-600 rounded-xl p-2 shadow-lg shadow-blue-600/20">
               <ShieldCheck className="text-white h-6 w-6" />
             </div>
             <div>
               <h1 className="text-xl font-bold dark:text-white">Rights Sentinel</h1>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Legal Assistant</p>
             </div>
           </div>
           <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-bold w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((stateOption) => (
                    <SelectItem key={stateOption.value} value={stateOption.value}>
                      {stateOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
           </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto container mx-auto max-w-4xl p-4 md:p-8 space-y-6">
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-blue-500/5 border">
               <Bot size={64} className="text-blue-600 mx-auto mb-6" />
               <h2 className="text-3xl font-black mb-2 dark:text-white">How can I help you today?</h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Ask me about evictions, repairs, deposits, or local housing ordinances in {stateLabel}.</p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                {[
                  "Can my landlord enter without notice?",
                  "How do I get my security deposit back?",
                  "What are the laws on rent increases?",
                  "How do I report a repair issue?"
                ].map(q => (
                  <button 
                    key={q} 
                    onClick={() => { setMessage(q); }}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition-all text-left shadow-sm"
                  >
                    {q}
                  </button>
                ))}
             </div>
          </div>
        )}

        <div className="space-y-8 pb-12">
          {chatHistory.map((chat, idx) => (
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               key={idx} 
               className={`flex gap-4 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${chat.role === 'user' ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950' : 'bg-blue-600 text-white'}`}>
                {chat.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm border ${chat.role === 'user' ? 'bg-white dark:bg-slate-900 rounded-tr-none' : 'bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800/30 rounded-tl-none text-slate-800 dark:text-slate-200'}`}>
                 {chat.role === 'assistant' ? (
                   <div className="prose prose-sm dark:prose-invert max-w-none">
                     <ReactMarkdown
                       components={{
                         p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                         strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-slate-100">{children}</strong>,
                         ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                         ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                         li: ({ children }) => <li className="ml-2">{children}</li>,
                         h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                         h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                         h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                         code: ({ children }) => <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs">{children}</code>,
                         blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-3 italic my-2">{children}</blockquote>,
                       }}
                     >
                       {chat.content}
                     </ReactMarkdown>
                   </div>
                 ) : (
                   chat.content
                 )}
                 {chat.isError && <div className="mt-2 text-xs font-bold text-red-500 uppercase">System Notice</div>}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <Bot size={20} />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-5 rounded-3xl rounded-tl-none flex gap-1 items-center border">
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-8 bg-white dark:bg-slate-900 border-t">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSendMessage} className="relative group">
            <Input 
              placeholder={`Ask about tenant rights in ${stateLabel}...`} 
              className="h-16 pl-6 pr-20 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] text-base focus-visible:ring-2 focus-visible:ring-blue-600 shadow-inner"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-transform active:scale-95"
              disabled={!message.trim() || isLoading}
            >
              <Send size={18} />
            </Button>
          </form>
          <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-[0.2em] selection:bg-none">
            AI Assistant provides information, not legal advice. Always verify with local statutes.
          </p>
        </div>
      </footer>
    </div>
  );
}
