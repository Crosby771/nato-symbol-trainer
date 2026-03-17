import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import ms from 'milsymbol';
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
    const symbol = new ms.Symbol(sidc, { size: 30 });
    return L.divIcon({
      className: 'custom-symbol-icon',
      html: symbol.asSVG(),
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  const MapEvents = () => {
    useMapEvents({
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
    return null;
  };

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[48.3794, 31.1656]} // Center of Ukraine
        zoom={6} 
        className="h-full w-full rounded-[32px]"
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
              <div className="text-center">
                <p className="font-bold mb-1">{symbol.name}</p>
                <p className="text-[10px] font-mono text-gray-500">{symbol.sidc}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPlacedSymbols(prev => prev.filter(s => s.id !== symbol.id));
                  }}
                  className="mt-2 text-rose-500 text-xs font-bold hover:underline cursor-pointer"
                >
                  Видалити
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Symbol Picker Overlay */}
      <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md p-6 rounded-[32px] shadow-2xl z-[1000] w-80 max-h-[85%] overflow-hidden border border-gray-100 flex flex-col">
        <h3 className="font-bold text-xl mb-2 text-[#5A5A40]">Тактичні знаки</h3>
        <p className="text-xs text-gray-500 mb-4 italic">Оберіть символ та натисніть на карту.</p>
        
        {/* Affiliation Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-2xl">
          {affiliations.map(aff => (
            <button
              key={aff.code}
              onClick={() => setActiveAffiliation(aff.code)}
              className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all ${
                activeAffiliation === aff.code 
                  ? 'bg-white shadow-sm text-[#5A5A40]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {aff.name}
            </button>
          ))}
        </div>

        {/* Category Selector & View Toggle */}
        <div className="flex gap-2 mb-4">
          <select 
            className="flex-1 p-3 bg-gray-50 rounded-2xl border-none text-sm font-medium focus:ring-2 focus:ring-[#5A5A40] outline-none"
            value={activeCategory || ''}
            onChange={(e) => setActiveCategory(e.target.value || null)}
          >
            <option value="">Всі категорії</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#5A5A40]' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-[#5A5A40]' : 'text-gray-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className={`overflow-y-auto pr-2 custom-scrollbar flex-1 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-2'}`}>
          {filteredSymbols.map((symbol) => (
            <button
              key={symbol.id}
              onClick={() => setSelectedSymbolSidc(symbol.sidc)}
              className={`rounded-2xl border-2 transition-all flex items-center group ${
                selectedSymbolSidc === symbol.sidc 
                  ? 'border-[#5A5A40] bg-[#5A5A40]/5' 
                  : 'border-transparent bg-gray-50 hover:bg-gray-100'
              } ${viewMode === 'grid' ? 'p-3 flex-col gap-2' : 'p-2 flex-row gap-4'}`}
            >
              <div className={`flex-shrink-0 transform group-hover:scale-110 transition-transform ${viewMode === 'list' ? 'bg-white p-1 rounded-xl shadow-sm' : ''}`}>
                <SymbolImage sidc={symbol.sidc} size={viewMode === 'grid' ? 40 : 32} />
              </div>
              <span className={`font-bold leading-tight text-gray-700 ${viewMode === 'grid' ? 'text-[10px] text-center' : 'text-xs text-left flex-1'}`}>
                {symbol.name}
              </span>
              {viewMode === 'list' && (
                <span className="text-[8px] font-mono text-gray-400 mr-2">{symbol.sidc.substring(10, 16)}</span>
              )}
            </button>
          ))}
        </div>

        {selectedSymbolSidc && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={() => setSelectedSymbolSidc(null)}
              className="w-full py-3 bg-[#5A5A40] text-white rounded-2xl text-xs font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Скасувати вибір
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
