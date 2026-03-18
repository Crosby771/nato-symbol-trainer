import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Map as MapIcon, 
  Menu, 
  X, 
  Shield,
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_SYMBOLS } from './lib/mockData';
import { SymbolImage } from './components/SymbolImage';
import { Difficulty } from './types';
import { Trainer } from './components/Trainer';
import { TacticalMap } from './components/TacticalMap';

type View = 'catalog' | 'trainer' | 'map' | 'training-session';

export default function App() {
  const [activeView, setActiveView] = useState<View>('catalog');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('basic');

  const startTraining = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setActiveView('training-session');
  };

  React.useEffect(() => {
    const handleExitMap = () => setActiveView('catalog');
    window.addEventListener('exit-map', handleExitMap);
    return () => window.removeEventListener('exit-map', handleExitMap);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-[#141417] border-r border-zinc-800 transition-all duration-300 z-50 hidden md:flex flex-col ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-zinc-800">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 font-bold text-lg tracking-tighter uppercase"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-mono">TAC-OPS v1.0</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-1 flex-1">
          <NavItem 
            icon={<BookOpen className="w-5 h-5" />} 
            label="Каталог" 
            active={activeView === 'catalog'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('catalog')}
          />
          <NavItem 
            icon={<GraduationCap className="w-5 h-5" />} 
            label="Тренажер" 
            active={activeView === 'trainer' || activeView === 'training-session'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('trainer')}
          />
          <NavItem 
            icon={<MapIcon className="w-5 h-5" />} 
            label="Тактична карта" 
            active={activeView === 'map'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('map')}
          />
        </nav>

        {/* System Status */}
        {isSidebarOpen && (
          <div className="p-6 border-t border-zinc-800">
            <div className="mb-6 pb-6 border-b border-zinc-800/50">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">Owner</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-200 tracking-tight">Ruslan Ponochovnyi</span>
                <div className="flex flex-col w-6 h-4 border border-zinc-800/50 overflow-hidden rounded-sm">
                  <div className="h-1/2 bg-[#0057B7]" />
                  <div className="h-1/2 bg-[#FFD700]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </div>
            <div className="text-[10px] font-mono text-zinc-600">
              COORD: 48.3794 N, 31.1656 E
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#141417]/90 backdrop-blur-md border-b border-zinc-800 z-[2000] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeView === 'training-session' ? (
            <button 
              onClick={() => setActiveView('trainer')}
              className="p-2 -ml-2 text-emerald-500 flex items-center gap-1"
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="text-xs font-bold uppercase tracking-widest">Назад</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 font-bold text-sm tracking-tighter uppercase">
              <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono leading-none">TAC-OPS</span>
                <span className="text-[8px] text-emerald-500 font-mono tracking-widest">SYSTEM_ACTIVE</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col w-5 h-3 border border-zinc-800/50 overflow-hidden rounded-sm">
            <div className="h-1/2 bg-[#0057B7]" />
            <div className="h-1/2 bg-[#FFD700]" />
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1900] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        {isSidebarOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[280px] bg-[#0a0a0b] z-[2100] md:hidden flex flex-col border-r border-zinc-800 shadow-2xl"
          >
            <div className="p-6 flex items-center justify-between border-b border-zinc-800 bg-[#141417]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-black">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-mono font-bold uppercase tracking-tighter">Command</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-6 space-y-3 flex-1">
              <MobileNavItem 
                icon={<BookOpen className="w-6 h-6" />} 
                label="Каталог" 
                active={activeView === 'catalog'} 
                onClick={() => { setActiveView('catalog'); setIsSidebarOpen(false); }}
              />
              <MobileNavItem 
                icon={<GraduationCap className="w-6 h-6" />} 
                label="Тренажер" 
                active={activeView === 'trainer' || activeView === 'training-session'} 
                onClick={() => { setActiveView('trainer'); setIsSidebarOpen(false); }}
              />
              <MobileNavItem 
                icon={<MapIcon className="w-6 h-6" />} 
                label="Тактична карта" 
                active={activeView === 'map'} 
                onClick={() => { setActiveView('map'); setIsSidebarOpen(false); }}
              />
            </nav>
            <div className="p-6 border-t border-zinc-800 bg-[#141417]/50">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">System Status</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-zinc-300">ENCRYPTED_LINK_STABLE</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-600">
                LAT: 48.3794 | LNG: 31.1656
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 pt-16 md:pt-8 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'} p-3 md:p-8 min-h-screen flex flex-col`}>
        <AnimatePresence mode="wait">
          {activeView === 'catalog' && <CatalogView key="catalog" />}
          {activeView === 'trainer' && <TrainerView onStart={startTraining} />}
          {activeView === 'training-session' && (
            <Trainer 
              key="training-session" 
              difficulty={selectedDifficulty} 
              onClose={() => setActiveView('trainer')} 
            />
          )}
          {activeView === 'map' && <MapView key="map" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
          : 'bg-zinc-900/50 text-zinc-400'
      }`}
    >
      <span className={active ? 'text-emerald-500' : ''}>{icon}</span>
      <span className="font-bold uppercase tracking-tight">{label}</span>
    </button>
  );
}

function NavItem({ icon, label, active, collapsed, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  collapsed: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all group ${
        active 
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
          : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
      }`}
    >
      <span className={`shrink-0 transition-colors ${active ? 'text-emerald-500' : 'group-hover:text-white'}`}>
        {icon}
      </span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium text-sm tracking-tight"
        >
          {label}
        </motion.span>
      )}
    </button>
  );
}

function CatalogView() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');

  const filteredSymbols = MOCK_SYMBOLS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.sidc.includes(search);
    const matchesDifficulty = difficulty === 'all' || s.difficulty === difficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-7xl mx-auto"
    >
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 md:pb-8">
        <div>
          <div className="text-emerald-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-2">Tactical Asset Library</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">Каталог символів</h1>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-zinc-500 font-mono text-xs uppercase mb-1">Standard Reference</div>
          <div className="text-zinc-300 font-mono text-sm">MIL-STD-2525D / APP-6</div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-3 md:gap-6 mb-6 md:mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 w-3.5 h-3.5 md:w-5 md:h-5 transition-colors" />
          <input 
            type="text" 
            placeholder="ПОШУК..."
            className="w-full pl-9 md:pl-12 pr-4 py-2 md:py-4 bg-[#141417] rounded-lg border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all font-mono text-[9px] md:text-sm uppercase tracking-wider"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex p-1 bg-[#141417] rounded-lg border border-zinc-800 overflow-x-auto no-scrollbar">
          {(['all', 'basic', 'intermediate', 'advanced'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 md:px-6 py-1 md:py-3 rounded-md font-mono text-[8px] md:text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                difficulty === d 
                  ? 'bg-emerald-500 text-black font-bold' 
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {d === 'all' ? 'Всі' : d === 'basic' ? 'Баз.' : d === 'intermediate' ? 'Сер.' : 'Прос.'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-zinc-800 border-x border-b border-zinc-800">
        {filteredSymbols.map((symbol) => (
          <motion.div 
            layout
            key={symbol.id}
            className="bg-[#0a0a0b] p-4 md:p-8 hover:bg-[#141417] transition-all cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-0 bg-emerald-500 group-hover:h-full transition-all duration-300" />
            
            <div className="flex items-start justify-between mb-3 md:mb-6">
              <div className="bg-zinc-900 p-2 md:p-4 rounded-lg border border-zinc-800 group-hover:border-emerald-500/30 transition-colors">
                <SymbolImage sidc={symbol.sidc} size={36} />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[7px] md:text-[9px] uppercase tracking-[0.2em] px-1.5 py-0.5 border font-bold ${
                  symbol.difficulty === 'basic' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5' :
                  symbol.difficulty === 'intermediate' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                  'border-rose-500/30 text-rose-500 bg-rose-500/5'
                }`}>
                  {symbol.difficulty}
                </span>
                <span className="text-[7px] md:text-[9px] font-mono text-zinc-600 uppercase">ID: {symbol.id.slice(0, 8)}</span>
              </div>
            </div>

            <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{symbol.name}</h3>
            <p className="text-[10px] md:text-xs text-zinc-500 font-mono mb-3 md:mb-6 tracking-wider">{symbol.sidc}</p>
            <p className="text-[13px] md:text-sm text-zinc-400 leading-relaxed font-light mb-4 md:mb-8 line-clamp-2 md:line-clamp-3">{symbol.description}</p>
            
            <div className="flex flex-wrap gap-1.5">
              {symbol.tags.map(tag => (
                <span key={tag} className="text-[7px] md:text-[9px] font-mono border border-zinc-800 text-zinc-600 px-1.5 py-0.5 uppercase tracking-tighter group-hover:border-zinc-700 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function TrainerView({ onStart }: { onStart: (difficulty: Difficulty) => void }) {
  return (
    <div className="max-w-5xl mx-auto py-6 md:py-12">
      <div className="text-center mb-8 md:mb-16">
        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-full mb-4 md:6 border border-emerald-500/20">
          <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-emerald-500" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 md:4 uppercase tracking-tighter">Тренажер знань</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto font-light text-sm md:text-sm px-4">Система перевірки знань тактичної символіки. Оберіть рівень складності для початку симуляції.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <TrainingCard 
          title="Базовий рівень"
          description="Основні бойові підрозділи та авіація. Фундаментальні знаки."
          icon={<Shield className="w-6 h-6" />}
          difficulty="BASIC"
          onClick={() => onStart('basic')}
        />
        <TrainingCard 
          title="Середній рівень"
          description="Підрозділи забезпечення, розвідка та техніка. Спеціальні знаки."
          icon={<Search className="w-6 h-6" />}
          difficulty="INTERMEDIATE"
          onClick={() => onStart('intermediate')}
        />
        <TrainingCard 
          title="Просунутий рівень"
          description="Спеціальні підрозділи та складні графічні знаки. Повна ідентифікація."
          icon={<Shield className="w-6 h-6" />}
          difficulty="ADVANCED"
          onClick={() => onStart('advanced')}
        />
      </div>
    </div>
  );
}

function TrainingCard({ title, description, icon, difficulty, onClick }: { title: string; description: string; icon: React.ReactNode; difficulty: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-[#141417] p-6 md:p-8 rounded-lg border border-zinc-800 hover:border-emerald-500/50 transition-all text-left group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-3 md:p-4 font-mono text-[8px] md:text-[10px] text-zinc-700 tracking-[0.3em]">{difficulty}</div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center mb-6 md:mb-8 group-hover:bg-emerald-500 group-hover:text-black transition-all">
        {icon}
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-[13px] md:text-sm leading-relaxed mb-6 md:mb-8 font-light">{description}</p>
      <div className="flex items-center text-emerald-500 font-mono text-[10px] md:text-xs uppercase tracking-widest">
        Launch Simulation <ChevronRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
      </div>
    </button>
  );
}

function MapView() {
  return (
    <div className="h-[500px] md:h-[600px] lg:h-[calc(100vh-12rem)] bg-[#141417] border border-zinc-800 rounded-lg overflow-hidden relative">
      <TacticalMap />
    </div>
  );
}
