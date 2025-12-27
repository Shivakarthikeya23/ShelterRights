import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { renterApi } from '../../lib/renterApi';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { 
  Users, 
  Plus, 
  MapPin, 
  Share2, 
  Target,
  Flame
} from 'lucide-react';

export default function CommunityOrganizerPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Campaign State
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await renterApi.getCampaigns();
      setCampaigns(data.campaigns);
    } catch (err) {
      console.error('Load campaigns error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await renterApi.createCampaign({
        title,
        locationCity: city,
        locationState: state,
        goalSignatures: 100
      });
      setShowCreateModal(false);
      setTitle('');
      setCity('');
      setState('');
      loadCampaigns();
    } catch (err) {
      console.error('Create campaign error:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSign = async (id: string) => {
    try {
      await renterApi.signCampaign(id, { isAnonymous: false });
      loadCampaigns();
    } catch (err) {
      console.error('Sign error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 text-slate-900 dark:text-slate-50">
      {/* Dynamic Header */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-6 py-16 max-w-7xl">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6"
                >
                  <Users className="h-3 w-3" />
                  <span>Unity is Power</span>
                </motion.div>
                <h1 className="text-5xl font-black tracking-tight mb-4 leading-tight">
                   Community <br />
                   <span className="text-emerald-600">Organizer</span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg">
                   Connect with neighbors and launch micro-campaigns for local policy changes. 1,247 residents active in your area.
                </p>
              </div>
              <Button 
                onClick={() => setShowCreateModal(true)}
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-emerald-500/20 transform hover:-translate-y-1 transition-all"
              >
                <Plus className="mr-2 h-5 w-5" /> Start a Campaign
              </Button>
           </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex items-center gap-2 mb-8">
          <Flame className="text-orange-500 h-5 w-5" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-sm">Trending Actions</h2>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(i => <div key={i} className="h-80 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((c) => (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 key={c.id}
              >
                <Card className="h-full rounded-[2.5rem] overflow-hidden border-0 shadow-lg bg-white dark:bg-slate-900 group hover:shadow-2xl transition-all duration-300">
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                       <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl group-hover:bg-emerald-600 transition-colors">
                          <Target className="h-6 w-6 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors" />
                       </div>
                       <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                         <MapPin size={10} /> {c.location_city}, {c.location_state}
                       </div>
                    </div>

                    <h3 className="text-xl font-black mb-3 group-hover:text-emerald-600 transition-colors">
                      {c.title}
                    </h3>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed italic">
                      "{c.description}"
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="space-y-2">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                           <span>Progress</span>
                           <span className="text-emerald-600">{Math.round((c.current_signatures / c.goal_signatures) * 100)}%</span>
                         </div>
                         <Progress value={(c.current_signatures / c.goal_signatures) * 100} className="h-2 bg-slate-100" />
                         <div className="text-[10px] font-bold text-slate-400 text-right">
                           {c.current_signatures} / {c.goal_signatures} Signatures
                         </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleSign(c.id)}
                          className="flex-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-emerald-600 transition-colors rounded-xl font-bold"
                        >
                          Sign Petition
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-xl border-dashed">
                          <Share2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal Scaffolding */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden text-slate-900 dark:text-slate-50"
           >
              <div className="p-8">
                 <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black tracking-tight">New Campaign</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>Close</Button>
                 </div>
                 
                 <form onSubmit={handleCreateCampaign} className="space-y-6">
                    <div className="space-y-2">
                       <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">Campaign Title</Label>
                       <Input 
                          placeholder="e.g. Stop Rent Hike at 5th St" 
                          className="h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">City</Label>
                           <Input 
                              placeholder="Austin" 
                              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              required
                           />
                        </div>
                        <div className="space-y-2">
                           <Label className="font-bold text-xs uppercase tracking-widest text-slate-400">State</Label>
                           <Input 
                              placeholder="TX" 
                              className="rounded-xl bg-slate-50 dark:bg-slate-800 border-none"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              required
                           />
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 flex gap-3 text-xs text-blue-600 font-medium leading-relaxed">
                       <Flame size={16} />
                       Our AI will automatically generate a compelling description for this campaign once you hit create.
                    </div>
                    <Button type="submit" disabled={isCreating} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-lg shadow-lg">
                       {isCreating ? 'Deploying...' : 'Launch Campaign'}
                    </Button>
                 </form>
              </div>
           </motion.div>
        </div>
      )}
    </div>
  );
}
