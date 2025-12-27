import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { renterApi } from '../../lib/renterApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Loader2, Send, Bot, User, MessageSquare, ShieldCheck, MapPin } from 'lucide-react';

export default function RightsChatbotPage() {
  const [message, setMessage] = useState('');
  const [state, setState] = useState('Texas'); // Default
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const data = await renterApi.chat(userMsg, state);
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
      {/* Sticky Header */}
      <header className="bg-white dark:bg-slate-900 border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
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
              <select 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm font-bold appearance-none cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <option value="Texas">Texas</option>
                <option value="California">California</option>
                <option value="New York">New York</option>
                <option value="Florida">Florida</option>
                <option value="Illinois">Illinois</option>
              </select>
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
               <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Ask me about evictions, repairs, deposits, or local housing ordinances in {state}.</p>
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
                 {chat.content}
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
              placeholder={`Ask about tenant rights in ${state}...`} 
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
