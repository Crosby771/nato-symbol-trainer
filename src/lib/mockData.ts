import { MilitarySymbol, Difficulty } from '../types';

const AFFILIATIONS = [
  { code: '03', name: 'Дружні', tag: 'friend' },
  { code: '06', name: 'Ворожі', tag: 'hostile' },
  { code: '04', name: 'Нейтральні', tag: 'neutral' },
  { code: '01', name: 'Невідомі', tag: 'unknown' },
];

const BASE_UNITS = [
  // LAND UNITS (Symbol Set 10)
  { set: '10', entity: '121100', name: 'Піхота', category: 'Піхота', difficulty: 'basic', tags: ['land', 'unit', 'combat'] },
  { set: '10', entity: '121102', name: 'Легка піхота', category: 'Піхота', difficulty: 'intermediate', tags: ['land', 'unit', 'combat', 'light'] },
  { set: '10', entity: '121104', name: 'Механізована піхота', category: 'Піхота', difficulty: 'intermediate', tags: ['land', 'unit', 'combat', 'mech'] },
  { set: '10', entity: '121103', name: 'Моторизована піхота', category: 'Піхота', difficulty: 'intermediate', tags: ['land', 'unit', 'combat', 'motorized'] },
  { set: '10', entity: '121105', name: 'Гірська піхота', category: 'Піхота', difficulty: 'advanced', tags: ['land', 'unit', 'combat', 'mountain'] },
  { set: '10', entity: '121101', name: 'Повітряно-десантна піхота', category: 'Піхота', difficulty: 'advanced', tags: ['land', 'unit', 'combat', 'airborne'] },
  
  { set: '10', entity: '120500', name: 'Танкові війська', category: 'Бронетанкові', difficulty: 'basic', tags: ['land', 'unit', 'combat', 'armor'] },
  { set: '10', entity: '120501', name: 'Важкі танкові війська', category: 'Бронетанкові', difficulty: 'intermediate', tags: ['land', 'unit', 'combat', 'armor', 'heavy'] },
  { set: '10', entity: '120502', name: 'Середні танкові війська', category: 'Бронетанкові', difficulty: 'intermediate', tags: ['land', 'unit', 'combat', 'armor', 'medium'] },
  
  { set: '10', entity: '130300', name: 'Артилерія', category: 'Артилерія', difficulty: 'basic', tags: ['land', 'unit', 'support', 'artillery'] },
  { set: '10', entity: '130301', name: 'Самохідна артилерія', category: 'Артилерія', difficulty: 'intermediate', tags: ['land', 'unit', 'support', 'artillery', 'sp'] },
  { set: '10', entity: '130302', name: 'Реактивна артилерія', category: 'Артилерія', difficulty: 'intermediate', tags: ['land', 'unit', 'support', 'artillery', 'rocket'] },
  
  { set: '10', entity: '130100', name: 'ППО', category: 'ППО', difficulty: 'basic', tags: ['land', 'unit', 'support', 'air-defense'] },
  { set: '10', entity: '121300', name: 'Розвідка', category: 'Розвідка', difficulty: 'basic', tags: ['land', 'unit', 'recon'] },
  { set: '10', entity: '121000', name: 'Інженерні війська', category: 'Інженерні', difficulty: 'basic', tags: ['land', 'unit', 'support', 'engineer'] },
  { set: '10', entity: '140100', name: 'Зв\'язок', category: 'Зв\'язок', difficulty: 'basic', tags: ['land', 'unit', 'support', 'signal'] },
  { set: '10', entity: '150100', name: 'Медична служба', category: 'Забезпечення', difficulty: 'basic', tags: ['land', 'unit', 'support', 'medical'] },
  { set: '10', entity: '160100', name: 'Логістика', category: 'Забезпечення', difficulty: 'basic', tags: ['land', 'unit', 'support', 'supply'] },
  
  // AIR UNITS (Symbol Set 01)
  { set: '01', entity: '110100', name: 'Літак', category: 'Авіація', difficulty: 'basic', tags: ['air', 'aviation', 'fixed'] },
  { set: '01', entity: '110101', name: 'Винищувач', category: 'Авіація', difficulty: 'intermediate', tags: ['air', 'aviation', 'fixed', 'fighter'] },
  { set: '01', entity: '110102', name: 'Бомбардувальник', category: 'Авіація', difficulty: 'intermediate', tags: ['air', 'aviation', 'fixed', 'bomber'] },
  { set: '01', entity: '110200', name: 'Вертоліт', category: 'Авіація', difficulty: 'basic', tags: ['air', 'aviation', 'rotary'] },
  { set: '01', entity: '110201', name: 'Ударний вертоліт', category: 'Авіація', difficulty: 'intermediate', tags: ['air', 'aviation', 'rotary', 'attack'] },
  { set: '01', entity: '110300', name: 'БПЛА', category: 'Авіація', difficulty: 'basic', tags: ['air', 'aviation', 'uav'] },
  
  // SEA SURFACE (Symbol Set 30)
  { set: '30', entity: '110100', name: 'Надводний корабель', category: 'Морські сили', difficulty: 'basic', tags: ['sea', 'surface'] },
  { set: '30', entity: '110101', name: 'Авіаносець', category: 'Морські сили', difficulty: 'intermediate', tags: ['sea', 'surface', 'carrier'] },
  { set: '30', entity: '110102', name: 'Крейсер', category: 'Морські сили', difficulty: 'intermediate', tags: ['sea', 'surface', 'cruiser'] },
  { set: '30', entity: '110103', name: 'Есмінець', category: 'Морські сили', difficulty: 'intermediate', tags: ['sea', 'surface', 'destroyer'] },
  { set: '30', entity: '110104', name: 'Фрегат', category: 'Морські сили', difficulty: 'intermediate', tags: ['sea', 'surface', 'frigate'] },
  
  // SUBSURFACE (Symbol Set 35)
  { set: '35', entity: '110100', name: 'Підводний човен', category: 'Морські сили', difficulty: 'basic', tags: ['sea', 'subsurface'] },
  
  // EQUIPMENT (Symbol Set 15)
  { set: '15', entity: '120100', name: 'Танк', category: 'Техніка', difficulty: 'basic', tags: ['land', 'equipment', 'tank'] },
  { set: '15', entity: '120200', name: 'БМП', category: 'Техніка', difficulty: 'intermediate', tags: ['land', 'equipment', 'ifv'] },
  { set: '15', entity: '120300', name: 'БТР', category: 'Техніка', difficulty: 'intermediate', tags: ['land', 'equipment', 'apc'] },
  { set: '15', entity: '140100', name: 'Гаубиця', category: 'Техніка', difficulty: 'intermediate', tags: ['land', 'equipment', 'howitzer'] },
  
  // INSTALLATIONS (Symbol Set 11)
  { set: '11', entity: '110100', name: 'Військовий об\'єкт', category: 'Об\'єкти', difficulty: 'basic', tags: ['land', 'installation'] },
  { set: '11', entity: '110200', name: 'Штаб', category: 'Об\'єкти', difficulty: 'advanced', tags: ['land', 'installation', 'hq'] },
];

export const MOCK_SYMBOLS: MilitarySymbol[] = (() => {
  const symbols: MilitarySymbol[] = [];
  const seenIds = new Set<string>();
  
  BASE_UNITS.forEach((base) => {
    AFFILIATIONS.forEach(aff => {
      // 20-digit SIDC (MIL-STD-2525D)
      // 1-2: Version (10)
      // 3-4: Identity (03 Friend, 06 Hostile, 04 Neutral, 01 Unknown)
      // 5-6: Symbol Set
      // 7: Status (0 Present)
      // 8: HQ/Task Force (0 None)
      // 9-10: Amplifier/Descriptor (00)
      // 11-16: Entity
      // 17-18: Modifier 1 (00)
      // 19-20: Modifier 2 (00)
      const version = '10';
      const identity = aff.code;
      const symbolSet = base.set;
      const status = '0';
      const hq = '0';
      const amplifier = '00';
      const entity = base.entity;
      const mod1 = '00';
      const mod2 = '00';
      
      const sidc = `${version}${identity}${symbolSet}${status}${hq}${amplifier}${entity}${mod1}${mod2}`;
      
      const id = `${base.name}-${aff.code}`;
      if (seenIds.has(id)) return;
      seenIds.add(id);
 
      symbols.push({
        id: id,
        sidc: sidc,
        name: base.name,
        category: base.category,
        description: `${base.name} (${aff.name}). Категорія: ${base.category}.`,
        difficulty: base.difficulty as Difficulty,
        tags: [...base.tags, aff.tag]
      });
    });
  });
 
  return symbols;
})();
