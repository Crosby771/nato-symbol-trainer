import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ms from 'milsymbol';
import { Menu, X, XCircle } from 'lucide-react';
import { MOCK_SYMBOLS } from '../lib/mockData';
import { SymbolImage } from './SymbolImage';

// Fix for default leaflet icons in React
const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface PlacedSymbol {
  id: string;
  sidc: string;
  lat: number;
  lng: number;
  name: string;
}

export const TacticalMap: React.FC = () => {
  const [placedSymbols, setPlacedSymbols] = useState<PlacedSymbol[]>([]);
  const [selectedSymbolSidc, setSelectedSymbolSidc] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeAffiliation, setActiveAffiliation] = useState<string | null>('03'); // Default to Friend
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = Array.from(new Set(MOCK_SYMBOLS.map(s => s.category)));
  const affiliations = [
    { code: '03', name: 'Дружні', color: 'text-emerald-500', tag: 'friend' },
    { code: '06', name: 'Ворожі', color: 'text-rose-500', tag: 'hostile' },
    { code: '04', name: 'Нейтральні', color: 'text-gray-500', tag: 'neutral' },
    { code: '01', name: 'Невідомі', color: 'text-amber-500', tag: 'unknown' },
  ];

  const filteredSymbols = MOCK_SYMBOLS.filter(s => {
    const matchesCategory = !activeCategory || s.category === activeCategory;
    const matchesAffiliation = s.tags.includes(affiliations.find(a => a.code === activeAffiliation)?.tag || '');
    return matchesCategory && matchesAffiliation;
  });

  const createSymbolIcon = (sidc: string) => {
    try {
      const symbol = new ms.Symbol(sidc, { size: 30 });
      if (!symbol.isValid()) {
        console.warn(`Invalid SIDC: ${sidc}`);
      }
      
      const canvas = symbol.asCanvas();
      
      return L.icon({
        iconUrl: canvas.toDataURL(),
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: 'tactical-symbol-icon'
      });
    } catch (err) {
      console.error('Error creating symbol icon:', err);
      return L.divIcon({ className: 'error-icon', html: '⚠️' });
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        if (selectedSymbolSidc) {
          const symbolTemplate = MOCK_SYMBOLS.find(s => s.sidc === selectedSymbolSidc);
          if (symbolTemplate) {
            const newSymbol: PlacedSymbol = {
              id: Math.random().toString(36).substr(2, 9),
              sidc: selectedSymbolSidc,
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              name: symbolTemplate.name
            };
            setPlacedSymbols(prev => [...prev, newSymbol]);
          }
        }
      },
    });

    // Force map to invalidate size on mount to ensure it fills container correctly
    React.useEffect(() => {
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }, [map]);

    return null;
  };

  const [isPickerOpen, setIsPickerOpen] = useState(true);

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[48.3794, 31.1656]} // Center of Ukraine
        zoom={6} 
        className="h-full w-full md:rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {placedSymbols.map((symbol) => (
          <Marker 
            key={symbol.id} 
            position={[symbol.lat, symbol.lng]} 
            icon={createSymbolIcon(symbol.sidc)}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold mb-1 text-sm">{symbol.name}</p>
                <p className="text-[10px] font-mono text-zinc-500 mb-2">{symbol.sidc}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPlacedSymbols(prev => prev.filter(s => s.id !== symbol.id));
                  }}
                  className="w-full py-1 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all"
                >
                  Видалити
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Active Selection Indicator */}
      {selectedSymbolSidc && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1001] pointer-events-none">
          <div className="bg-[#141417]/90 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-3 animate-bounce">
            <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <SymbolImage sidc={selectedSymbolSidc} size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-mono text-emerald-500 uppercase tracking-widest leading-none mb-1">Active Asset</span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-white leading-none">
                {MOCK_SYMBOLS.find(s => s.sidc === selectedSymbolSidc)?.name || 'Unknown'}
              </span>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSymbolSidc(null);
              }}
              className="pointer-events-auto ml-2 p-1 hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Symbol Picker Overlay */}
      <div className={`fixed md:absolute z-[1000] transition-all duration-500 ease-in-out
        ${isPickerOpen 
          ? 'translate-y-0 md:translate-x-0 opacity-100' 
          : 'translate-y-full md:-translate-x-[calc(100%+2rem)] opacity-0 md:opacity-0'
        }
        bottom-0 left-0 right-0 md:bottom-auto md:top-4 md:left-4 md:right-auto
      `}>
        <div className="bg-[#141417]/98 backdrop-blur-xl p-3 md:p-6 rounded-t-3xl md:rounded-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-2xl w-full md:w-80 max-h-[60vh] md:max-h-[85vh] overflow-hidden border-t md:border border-zinc-800 flex flex-col">
          {/* Mobile Drag Handle */}
          <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto mb-3 md:hidden" />

          <div className="flex items-center justify-between mb-2 md:mb-4 border-b border-zinc-800 pb-2 md:pb-3">
            <div>
              <div className="text-emerald-500 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] mb-0.5 md:mb-1">Asset Selection</div>
              <h3 className="font-bold text-base md:text-xl uppercase tracking-tight">Тактичні знаки</h3>
            </div>
            <button 
              onClick={() => setIsPickerOpen(false)}
              className="p-1.5 md:p-2 text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-900 rounded-md border border-zinc-800"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
          
          {/* Affiliation Tabs - More compact on mobile */}
          <div className="flex gap-1 mb-2 md:mb-4 bg-zinc-900 p-0.5 md:p-1 rounded-md border border-zinc-800 overflow-x-auto no-scrollbar">
            {affiliations.map(aff => (
              <button
                key={aff.code}
                onClick={() => setActiveAffiliation(aff.code)}
                className={`flex-1 py-1.5 md:py-2 px-1.5 md:px-2 text-[8px] md:text-[9px] font-mono uppercase tracking-tighter rounded transition-all whitespace-nowrap ${
                  activeAffiliation === aff.code 
                    ? 'bg-emerald-500 text-black font-bold' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {aff.name}
              </button>
            ))}
          </div>

          {/* Category Selector - More compact on mobile */}
          <div className="flex gap-1.5 mb-2 md:mb-4">
            <select 
              className="flex-1 p-1.5 md:p-2 bg-zinc-900 border border-zinc-800 rounded-md text-[9px] md:text-[10px] font-mono uppercase tracking-wider text-zinc-300 focus:border-emerald-500/50 outline-none appearance-none cursor-pointer"
              value={activeCategory || ''}
              onChange={(e) => setActiveCategory(e.target.value || null)}
            >
              <option value="">Всі категорії</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex bg-zinc-900 p-0.5 md:p-1 rounded-md border border-zinc-800">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1 md:p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1 md:p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-emerald-500' : 'text-zinc-600 hover:text-zinc-400'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
          </div>

          <div className={`overflow-y-auto pr-1 custom-scrollbar flex-1 ${viewMode === 'grid' ? 'grid grid-cols-3 md:grid-cols-2 gap-1.5 md:gap-2' : 'flex flex-col gap-1'}`}>
            {filteredSymbols.map((symbol) => (
              <button
                key={symbol.id}
                onClick={() => {
                  setSelectedSymbolSidc(symbol.sidc);
                  if (window.innerWidth < 768) setIsPickerOpen(false);
                }}
                className={`rounded-md border transition-all flex items-center group relative overflow-hidden ${
                  selectedSymbolSidc === symbol.sidc 
                    ? 'border-emerald-500/50 bg-emerald-500/5' 
                    : 'border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-zinc-700'
                } ${viewMode === 'grid' ? 'p-1.5 md:p-2 flex-col gap-1.5' : 'p-1 md:p-1.5 flex-row gap-2'}`}
              >
                <div className={`flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${viewMode === 'list' ? 'bg-zinc-900 p-0.5 rounded border border-zinc-800' : ''}`}>
                  <SymbolImage sidc={symbol.sidc} size={viewMode === 'grid' ? 24 : 20} />
                </div>
                <span className={`font-medium tracking-tight uppercase text-zinc-300 group-hover:text-white transition-colors ${viewMode === 'grid' ? 'text-[8px] text-center' : 'text-[9px] text-left flex-1'}`}>
                  {symbol.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t border-zinc-800 flex flex-col gap-1.5">
            {selectedSymbolSidc && (
              <button 
                onClick={() => setSelectedSymbolSidc(null)}
                className="w-full py-2 md:py-2 bg-zinc-800 text-zinc-400 rounded-md text-[9px] md:text-[9px] font-mono uppercase tracking-[0.2em] hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700"
              >
                Скасувати вибір
              </button>
            )}

            {placedSymbols.length > 0 && (
              <button 
                onClick={() => setPlacedSymbols([])}
                className="w-full py-2 md:py-2 bg-rose-500/10 text-rose-500 rounded-md text-[9px] md:text-[9px] font-mono uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20"
              >
                Очистити карту
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toggle Button for Picker */}
      {!isPickerOpen && (
        <div className="absolute top-20 md:top-4 left-2 md:left-4 z-[1001] flex flex-col gap-2">
          <button 
            onClick={() => setIsPickerOpen(true)}
            className="p-3 bg-emerald-500 text-black rounded-lg shadow-lg hover:bg-emerald-400 transition-all border-2 border-black/20 flex items-center gap-2 group"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">Open Assets</span>
          </button>
          
          {/* Mobile Exit Button */}
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('exit-map'))}
            className="md:hidden p-3 bg-zinc-900 text-rose-500 rounded-lg shadow-lg border border-zinc-800 flex items-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Exit Map</span>
          </button>
        </div>
      )}
    </div>
  );
};
