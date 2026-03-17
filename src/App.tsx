import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Map as MapIcon, 
  Menu, 
  X, 
  Shield,
  Search,
  ChevronRight
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

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1a1a1a] font-serif">
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-[#5A5A40] text-white transition-all duration-300 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 font-bold text-xl tracking-tight"
            >
              <Shield className="w-6 h-6" />
              <span>APP-6 Trainer</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2 flex-1">
          <NavItem 
            icon={<BookOpen />} 
            label="Каталог" 
            active={activeView === 'catalog'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('catalog')}
          />
          <NavItem 
            icon={<GraduationCap />} 
            label="Тренажер" 
            active={activeView === 'trainer' || activeView === 'training-session'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('trainer')}
          />
          <NavItem 
            icon={<MapIcon />} 
            label="Тактична карта" 
            active={activeView === 'map'} 
            collapsed={!isSidebarOpen}
            onClick={() => setActiveView('map')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8`}>
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
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
        active 
          ? 'bg-white text-[#5A5A40] shadow-lg' 
          : 'hover:bg-white/10 text-white/80'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && (
        <motion.span 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium"
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
      className="max-w-6xl mx-auto"
    >
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-4 text-[#5A5A40]">Каталог символів</h1>
        <p className="text-xl text-gray-600 italic">Довідник військових знаків НАТО APP-6 / MIL-STD-2525</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Пошук за назвою або SIDC..."
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#5A5A40] outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'basic', 'intermediate', 'advanced'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-6 py-4 rounded-2xl font-medium transition-all ${
                difficulty === d 
                  ? 'bg-[#5A5A40] text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {d === 'all' ? 'Всі' : d === 'basic' ? 'Базовий' : d === 'intermediate' ? 'Середній' : 'Просунутий'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSymbols.map((symbol) => (
          <motion.div 
            layout
            key={symbol.id}
            className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-transparent hover:border-[#5A5A40]/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-[#5A5A40]/5 transition-colors">
                <SymbolImage sidc={symbol.sidc} size={80} />
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold ${
                symbol.difficulty === 'basic' ? 'bg-emerald-100 text-emerald-700' :
                symbol.difficulty === 'intermediate' ? 'bg-amber-100 text-amber-700' :
                'bg-rose-100 text-rose-700'
              }`}>
                {symbol.difficulty}
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-[#5A5A40]">{symbol.name}</h3>
            <p className="text-sm text-gray-500 font-mono mb-4">{symbol.sidc}</p>
            <p className="text-gray-600 line-clamp-2 italic">{symbol.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {symbol.tags.map(tag => (
                <span key={tag} className="text-[10px] bg-gray-100 px-2 py-1 rounded uppercase font-bold text-gray-400">
                  #{tag}
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
    <div className="max-w-4xl mx-auto text-center py-20">
      <GraduationCap className="w-20 h-20 mx-auto mb-8 text-[#5A5A40] opacity-20" />
      <h2 className="text-4xl font-bold mb-4">Тренажер знань</h2>
      <p className="text-xl text-gray-600 mb-12 italic">Оберіть режим тренування для перевірки ваших знань символіки НАТО.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TrainingCard 
          title="Базовий рівень"
          description="Основні бойові підрозділи та авіація."
          icon={<Shield className="w-8 h-8" />}
          onClick={() => onStart('basic')}
        />
        <TrainingCard 
          title="Середній рівень"
          description="Підрозділи забезпечення, розвідка та техніка."
          icon={<Search className="w-8 h-8" />}
          onClick={() => onStart('intermediate')}
        />
        <TrainingCard 
          title="Просунутий рівень"
          description="Спеціальні підрозділи та складні графічні знаки."
          icon={<Shield className="w-8 h-8" />}
          onClick={() => onStart('advanced')}
        />
      </div>
    </div>
  );
}

function TrainingCard({ title, description, icon, onClick }: { title: string; description: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-white p-8 rounded-[32px] shadow-sm hover:shadow-2xl transition-all text-left group border-2 border-transparent hover:border-[#5A5A40]"
    >
      <div className="w-16 h-16 bg-[#f5f5f0] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#5A5A40] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 italic mb-6">{description}</p>
      <div className="flex items-center text-[#5A5A40] font-bold">
        Почати <ChevronRight className="ml-2 w-4 h-4" />
      </div>
    </button>
  );
}

function MapView() {
  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-[32px] shadow-sm overflow-hidden relative">
      <TacticalMap />
    </div>
  );
}
