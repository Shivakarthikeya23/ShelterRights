import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Home, Shield, Users, ArrowRight, CheckCircle2, Globe, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-blue-100 dark:selection:bg-blue-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2 shadow-lg shadow-blue-500/30">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              ShelterRights
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">Sign in</Link>
            <Link to="/signup">
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-full px-6 font-bold">
                Join Now
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Animated Hero Section */}
        <section className="container mx-auto px-6 py-20 lg:py-32 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 border border-blue-100 dark:border-blue-800">
                <Globe className="h-3.5 w-3.5" />
                <span>Housing Justice for All</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black leading-[1.05] tracking-tighter mb-8 text-slate-900 dark:text-white">
                Take Control of Your <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Housing Future
                </span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-lg">
                131 Million Americans struggle with housing affordability. We provide the tools, data, and community to help you navigate the crisis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-black text-lg h-16 px-12 rounded-2xl shadow-2xl shadow-blue-500/30 transform hover:-translate-y-1 transition-all group">
                    Get Started Free <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, delay: 0.2 }}
               className="relative lg:ml-10"
            >
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-800 shadow-blue-500/10">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Modern Apartment" 
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-blue-600 text-white p-10 rounded-[2rem] shadow-2xl">
                <div className="text-5xl font-black mb-1 leading-none">30%</div>
                <div className="text-xs font-bold uppercase tracking-widest text-blue-100 opacity-80">Ideal Rent Limit</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="container mx-auto px-6 py-24 max-w-7xl bg-slate-50/50 dark:bg-slate-900/20 rounded-[4rem] my-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Powerful tools for modern residents</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed italic">Everything you need to secure your place in the world.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <motion.div whileHover={{ y: -10 }} className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group">
              <div className="bg-blue-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg shadow-blue-600/20">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white leading-tight">Affordability Engine</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                Calculates "true cost" including utilities, commute, and local tax impact.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group">
              <div className="bg-indigo-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg shadow-indigo-600/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white leading-tight">Rights Sentinel</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                AI insights into local housing laws. Know your rights before signing.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="p-12 rounded-[3.5rem] bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group">
              <div className="bg-emerald-600 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-10 shadow-lg shadow-emerald-600/20">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-4 text-slate-900 dark:text-white leading-tight">Collective Action</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                Organize campaigns, sign petitions, and build community power.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="footer bg-white dark:bg-slate-950 border-t py-20">
        <div className="container mx-auto px-6 max-w-7xl text-center">
          <p className="text-lg font-black text-slate-900 dark:text-white mb-4 italic">Empowering residents everywhere.</p>
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
            © 2024 ShelterRights • Built for Justice
          </div>
        </div>
      </footer>
    </div>
  );
}
