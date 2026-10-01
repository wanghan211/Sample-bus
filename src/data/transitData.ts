export type CrowdDensity = 'seats' | 'standing' | 'crowded';
export type DeckType = 'DD' | 'SD' | 'BD';

export interface BusArrivalInfo {
  etaMinutes: number | 'Arr';
  crowd: CrowdDensity;
  deck: DeckType;
  wab: boolean; // Wheelchair accessible
}

export interface BusService {
  serviceNo: string;
  category: 'Trunk' | 'Express' | 'Feeder';
  operator: 'SBS Transit' | 'SMRT' | 'Tower Transit' | 'Go-Ahead';
  destination: string;
  origin: string;
  viaText: string;
  firstBus: string;
  lastBus: string;
  frequency: string;
  status: 'On Time' | 'Minor Delay' | 'Normal';
  totalStops: number;
  currentStopIndex: number;
  arrivals: BusArrivalInfo[];
  approachTracker: {
    stopsAway: number;
    prevStop: string;
    busCurrentStop: string;
    targetStop: string;
  };
  stops: RouteStop[];
}

export interface RouteStop {
  code: string;
  name: string;
  road: string;
  subText?: string;
  seq: number;
  isMrt?: boolean;
  mrtCode?: string;
  status: 'departed' | 'current' | 'upcoming';
  departedAgo?: string;
  etaText?: string;
  crowd?: CrowdDensity;
  deck?: DeckType;
  wab?: boolean;
}

export interface BusStop {
  code: string;
  name: string;
  road: string;
  description: string;
  distanceMeters: number;
  walkMinutes: number;
  isFavorite: boolean;
  transitCorridor?: string;
  services: {
    serviceNo: string;
    destination: string;
    wab: boolean;
    deck: DeckType;
    arrivals: BusArrivalInfo[];
  }[];
  alsoServing: string[];
}

export const BUS_SERVICES_DATA: Record<string, BusService> = {
  '14': {
    serviceNo: '14',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'Clementi Int',
    destination: 'Bedok Temp Int',
    viaText: 'via Somerset, Clarke Quay, Mountbatten',
    firstBus: '05:30',
    lastBus: '23:45',
    frequency: '6 - 10 mins',
    status: 'On Time',
    totalStops: 48,
    currentStopIndex: 18,
    arrivals: [
      { etaMinutes: 'Arr', crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 9, crowd: 'standing', deck: 'SD', wab: true },
      { etaMinutes: 18, crowd: 'seats', deck: 'DD', wab: true }
    ],
    approachTracker: {
      stopsAway: 2,
      prevStop: 'Delfi Orch',
      busCurrentStop: 'Thai Embassy',
      targetStop: 'You are here'
    },
    stops: [
      { code: 'B08031', name: 'Dhoby Ghaut Stn', road: 'Penang Rd', seq: 17, status: 'departed', departedAgo: '4 min ago' },
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Turn • Exit 1', seq: 18, status: 'current', etaText: '~ Arr (11:42)', crowd: 'seats', deck: 'DD', wab: true },
      { code: 'B09031', name: 'Midpoint Orchard', road: 'Orchard Rd', seq: 19, status: 'upcoming', etaText: 'In 5 min', crowd: 'seats' },
      { code: 'B08121', name: 'Somerset Stn', road: 'Somerset Rd • NS23', seq: 20, isMrt: true, mrtCode: 'NS23', status: 'upcoming', etaText: 'In 9 min', crowd: 'standing' },
      { code: 'B09039', name: 'Opp Mandarin Orchard', road: 'Orchard Link', seq: 21, status: 'upcoming', etaText: 'In 12 min', crowd: 'standing' },
      { code: 'B08111', name: 'Concorde Hotel S\'pore', road: 'Orchard Rd', seq: 22, status: 'upcoming', etaText: 'In 16 min', crowd: 'crowded' },
      { code: 'B04111', name: 'Dhoby Ghaut MRT Exit B', road: 'Orchard Rd', seq: 23, isMrt: true, mrtCode: 'NS24/NE6/CC1', status: 'upcoming', etaText: 'In 20 min', crowd: 'seats' },
      { code: 'B04121', name: 'SMU Li Ka Shing Bldg', road: 'Bras Basah Rd', seq: 24, status: 'upcoming', etaText: 'In 24 min', crowd: 'seats' },
      { code: 'B04219', name: 'Opp The Treasury', road: 'North Bridge Rd', seq: 25, status: 'upcoming', etaText: 'In 28 min', crowd: 'standing' },
      { code: 'B05019', name: 'Clarke Quay Stn', road: 'Eu Tong Sen St', seq: 26, isMrt: true, mrtCode: 'NE5', status: 'upcoming', etaText: 'In 32 min', crowd: 'seats' },
      { code: 'B84009', name: 'Bedok Temp Int', road: 'Bedok North Ave 1', seq: 48, status: 'upcoming', etaText: 'In 64 min', crowd: 'seats' }
    ]
  },
  '65': {
    serviceNo: '65',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'HarbourFront Int',
    destination: 'Tampines Int',
    viaText: 'via Orchard, Dhoby Ghaut, Bendemeer, Bedok Reservoir',
    firstBus: '05:45',
    lastBus: '23:45',
    frequency: '7 - 12 mins',
    status: 'On Time',
    totalStops: 42,
    currentStopIndex: 14,
    arrivals: [
      { etaMinutes: 3, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 14, crowd: 'standing', deck: 'SD', wab: true },
      { etaMinutes: 24, crowd: 'crowded', deck: 'DD', wab: true }
    ],
    approachTracker: {
      stopsAway: 1,
      prevStop: 'Paterson Lodge',
      busCurrentStop: 'Opp Orchard Stn',
      targetStop: 'Approaching'
    },
    stops: [
      { code: 'B08031', name: 'Dhoby Ghaut Stn', road: 'Penang Rd', seq: 13, status: 'departed', departedAgo: '3 min ago' },
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Turn • Exit 1', seq: 14, status: 'current', etaText: '~ 3 min (11:42)', crowd: 'seats', deck: 'DD', wab: true },
      { code: 'B09031', name: 'Midpoint Orchard', road: 'Orchard Rd', seq: 15, status: 'upcoming', etaText: 'In 7 min', crowd: 'seats' },
      { code: 'B08121', name: 'Somerset Stn', road: 'Somerset Rd • NS23', seq: 16, isMrt: true, mrtCode: 'NS23', status: 'upcoming', etaText: 'In 11 min', crowd: 'standing' },
      { code: 'B09039', name: 'Opp Mandarin Orchard', road: 'Orchard Link', seq: 17, status: 'upcoming', etaText: 'In 14 min', crowd: 'standing' },
      { code: 'B08111', name: 'Concorde Hotel S\'pore', road: 'Orchard Rd', seq: 18, status: 'upcoming', etaText: 'In 18 min', crowd: 'crowded' },
      { code: 'B08057', name: 'Little India Stn Exit A', road: 'Bukit Timah Rd', seq: 22, isMrt: true, mrtCode: 'NE7/DT12', status: 'upcoming', etaText: 'In 26 min', crowd: 'seats' },
      { code: 'B60011', name: 'Bendemeer Stn Exit B', road: 'Kallang Bahru', seq: 27, isMrt: true, mrtCode: 'DT23', status: 'upcoming', etaText: 'In 35 min', crowd: 'seats' },
      { code: 'B75009', name: 'Tampines Int', road: 'Tampines Central 1', seq: 42, status: 'upcoming', etaText: 'In 58 min', crowd: 'seats' }
    ]
  },
  '124': {
    serviceNo: '124',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'St. Michael\'s Ter',
    destination: 'Telok Blangah Heights',
    viaText: 'via Newton, Orchard, Havelock, HarbourFront',
    firstBus: '06:00',
    lastBus: '23:30',
    frequency: '9 - 14 mins',
    status: 'On Time',
    totalStops: 36,
    currentStopIndex: 12,
    arrivals: [
      { etaMinutes: 'Arr', crowd: 'standing', deck: 'SD', wab: true },
      { etaMinutes: 10, crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 22, crowd: 'seats', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 1,
      prevStop: 'Newton Stn',
      busCurrentStop: 'Royal Plaza',
      targetStop: 'You are here'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Turn', seq: 12, status: 'current', etaText: 'Arr', crowd: 'standing', deck: 'SD', wab: true },
      { code: 'B09031', name: 'Midpoint Orchard', road: 'Orchard Rd', seq: 13, status: 'upcoming', etaText: 'In 4 min', crowd: 'seats' }
    ]
  },
  '143': {
    serviceNo: '143',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'Toa Payoh Int',
    destination: 'Jurong East Temp Int',
    viaText: 'via Novena, Orchard, Chinatown, Pasir Panjang, West Coast',
    firstBus: '05:40',
    lastBus: '23:30',
    frequency: '7 - 12 mins',
    status: 'On Time',
    totalStops: 56,
    currentStopIndex: 21,
    arrivals: [
      { etaMinutes: 7, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 16, crowd: 'standing', deck: 'DD', wab: true },
      { etaMinutes: 28, crowd: 'seats', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 3,
      prevStop: 'Balmoral Plaza',
      busCurrentStop: 'Far East Plaza',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Blvd', seq: 21, status: 'current', etaText: 'In 7 min', crowd: 'seats', deck: 'DD', wab: true }
    ]
  },
  '167': {
    serviceNo: '167',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'Sembawang Int',
    destination: 'Bukit Merah Int',
    viaText: 'via Upper Thomson, Novena, Orchard, Tanjong Pagar',
    firstBus: '05:30',
    lastBus: '23:15',
    frequency: '10 - 15 mins',
    status: 'Minor Delay',
    totalStops: 44,
    currentStopIndex: 26,
    arrivals: [
      { etaMinutes: 12, crowd: 'crowded', deck: 'SD', wab: true },
      { etaMinutes: 25, crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 38, crowd: 'seats', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 4,
      prevStop: 'Novena Stn',
      busCurrentStop: 'Newton Circus',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Blvd', seq: 26, status: 'current', etaText: 'In 12 min', crowd: 'crowded', deck: 'SD', wab: true }
    ]
  },
  '174': {
    serviceNo: '174',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'New Bridge Rd Ter',
    destination: 'Boon Lay Int',
    viaText: 'via Orchard, Farrer Rd, Bukit Timah, Jurong West',
    firstBus: '05:45',
    lastBus: '23:45',
    frequency: '8 - 14 mins',
    status: 'On Time',
    totalStops: 52,
    currentStopIndex: 16,
    arrivals: [
      { etaMinutes: 15, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 27, crowd: 'standing', deck: 'DD', wab: true },
      { etaMinutes: 39, crowd: 'seats', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 5,
      prevStop: 'Fort Canning Stn',
      busCurrentStop: 'Penang Rd',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Blvd', seq: 16, status: 'current', etaText: 'In 15 min', crowd: 'seats', deck: 'DD', wab: true }
    ]
  },
  '502': {
    serviceNo: '502',
    category: 'Express',
    operator: 'SBS Transit',
    origin: 'Soon Lee Bus Depot',
    destination: 'Marina Bay / Bayfront',
    viaText: 'Express via AYE, Orchard Blvd, Suntec City',
    firstBus: '06:00',
    lastBus: '23:00',
    frequency: '12 - 18 mins',
    status: 'On Time',
    totalStops: 38,
    currentStopIndex: 19,
    arrivals: [
      { etaMinutes: 11, crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 26, crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 42, crowd: 'standing', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 3,
      prevStop: 'Clementi Flyover',
      busCurrentStop: 'Tanglin Rd',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Blvd', seq: 19, status: 'current', etaText: 'In 11 min', crowd: 'seats', deck: 'SD', wab: true }
    ]
  },
  '190': {
    serviceNo: '190',
    category: 'Trunk',
    operator: 'SMRT',
    origin: 'Choa Chu Kang Int',
    destination: 'Kampong Bahru Ter',
    viaText: 'Express via BKE, PIE, Stevens, Orchard',
    firstBus: '05:30',
    lastBus: '23:30',
    frequency: '5 - 9 mins',
    status: 'On Time',
    totalStops: 34,
    currentStopIndex: 18,
    arrivals: [
      { etaMinutes: 2, crowd: 'standing', deck: 'BD', wab: true },
      { etaMinutes: 8, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 14, crowd: 'seats', deck: 'DD', wab: true }
    ],
    approachTracker: {
      stopsAway: 1,
      prevStop: 'Scotts Rd',
      busCurrentStop: 'Royal Plaza',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09022', name: 'Opp Orchard Stn', road: 'Orchard Blvd', seq: 18, status: 'current', etaText: 'In 2 min', crowd: 'standing', deck: 'BD', wab: true }
    ]
  },
  '7': {
    serviceNo: '7',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'Bedok Int',
    destination: 'Clementi Int',
    viaText: 'via Geylang, Bugis, Orchard, Holland Rd',
    firstBus: '05:30',
    lastBus: '23:50',
    frequency: '6 - 11 mins',
    status: 'On Time',
    totalStops: 46,
    currentStopIndex: 23,
    arrivals: [
      { etaMinutes: 1, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 8, crowd: 'seats', deck: 'DD', wab: true },
      { etaMinutes: 18, crowd: 'standing', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 1,
      prevStop: 'Peranakan Place',
      busCurrentStop: 'Heeren',
      targetStop: 'Lucky Plaza'
    },
    stops: [
      { code: 'B09048', name: 'Orchard Stn / Lucky Plaza', road: 'Orchard Rd', seq: 23, status: 'current', etaText: 'In 1 min', crowd: 'seats', deck: 'DD', wab: true }
    ]
  },
  '111': {
    serviceNo: '111',
    category: 'Trunk',
    operator: 'SBS Transit',
    origin: 'Ghim Moh Ter',
    destination: 'Marina Centre Ter',
    viaText: 'via Commonwealth, Queenstown, Tanglin, Orchard',
    firstBus: '06:00',
    lastBus: '23:30',
    frequency: '10 - 15 mins',
    status: 'On Time',
    totalStops: 32,
    currentStopIndex: 15,
    arrivals: [
      { etaMinutes: 'Arr', crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 12, crowd: 'seats', deck: 'SD', wab: true },
      { etaMinutes: 25, crowd: 'standing', deck: 'SD', wab: true }
    ],
    approachTracker: {
      stopsAway: 1,
      prevStop: 'Camden Med Ctr',
      busCurrentStop: 'Bef Orchard Blvd',
      targetStop: 'Opp Orchard Stn'
    },
    stops: [
      { code: 'B09011', name: 'Bef Orchard Blvd', road: 'Paterson Rd', seq: 15, status: 'current', etaText: 'Arr', crowd: 'seats', deck: 'SD', wab: true }
    ]
  }
};

export const BUS_STOPS_DATA: BusStop[] = [
  {
    code: 'B09022',
    name: 'Opp Orchard Stn / ION Orchard',
    road: 'Orchard Blvd',
    description: 'In front of ION Orchard & Orchard Boulevard entrance',
    distanceMeters: 85,
    walkMinutes: 1,
    isFavorite: true,
    transitCorridor: 'Downtown • North-South MRT Link',
    services: [
      {
        serviceNo: '14',
        destination: 'Bedok Int',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 'Arr', crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 6, crowd: 'standing', deck: 'SD', wab: true },
          { etaMinutes: 17, crowd: 'seats', deck: 'DD', wab: true }
        ]
      },
      {
        serviceNo: '65',
        destination: 'Tampines',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 2, crowd: 'standing', deck: 'SD', wab: true },
          { etaMinutes: 11, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 24, crowd: 'crowded', deck: 'DD', wab: true }
        ]
      }
    ],
    alsoServing: ['124', '143', '167', '174', '190', '502']
  },
  {
    code: '09048',
    name: 'Orchard Stn / Lucky Plaza',
    road: 'Orchard Rd',
    description: 'Outside Lucky Plaza Taxi Stand',
    distanceMeters: 160,
    walkMinutes: 2,
    isFavorite: false,
    transitCorridor: 'Shopping Belt • North-South Line',
    services: [
      {
        serviceNo: '7',
        destination: 'Clementi',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 1, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 8, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 18, crowd: 'standing', deck: 'SD', wab: true }
        ]
      },
      {
        serviceNo: '174',
        destination: 'Boon Lay',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 'Arr', crowd: 'standing', deck: 'DD', wab: true },
          { etaMinutes: 14, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 29, crowd: 'seats', deck: 'DD', wab: true }
        ]
      }
    ],
    alsoServing: ['36', '77', '105', '106', '111', '123']
  },
  {
    code: '09011',
    name: 'Bef Orchard Blvd',
    road: 'Paterson Rd',
    description: 'Opposite Angullia Park & Paterson Hill',
    distanceMeters: 290,
    walkMinutes: 4,
    isFavorite: false,
    transitCorridor: 'Paterson Bypass Link',
    services: [
      {
        serviceNo: '14',
        destination: 'Bedok',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 3, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 14, crowd: 'seats', deck: 'SD', wab: true }
        ]
      },
      {
        serviceNo: '65',
        destination: 'Tampines',
        wab: true,
        deck: 'DD',
        arrivals: [
          { etaMinutes: 9, crowd: 'seats', deck: 'DD', wab: true },
          { etaMinutes: 21, crowd: 'seats', deck: 'SD', wab: true }
        ]
      },
      {
        serviceNo: '111',
        destination: 'Ghim Moh',
        wab: true,
        deck: 'SD',
        arrivals: [
          { etaMinutes: 'Arr', crowd: 'seats', deck: 'SD', wab: true },
          { etaMinutes: 12, crowd: 'seats', deck: 'SD', wab: true }
        ]
      }
    ],
    alsoServing: ['16', '175', '502']
  }
];

export const SBS_TRANSIT_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1UDlIyICeWy_n1hHW6ktf53lYbIXON3DZ7rSqzpzH3wbXeetO78Cu_x8fkvMVY4i96y2b11xlOpKGIEf0ALYK9e8imbyCJrrJCB6tT6RoT6Y37bJbxjwSd599c3p03epAOuyQVr9B1HFnF3UwT31JgbDOlQkGRoZEiVNLh27VHQdSeJnisj1w27WC_Mo6Br_3KkemqKfulmwsTysnQtkj_DOlVHmexEmT_E9Y84UPWG2DavKFoHrgEuL8Ih';
export const MAP_PREVIEW_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjDqyTQxtotpwwOem9Vbr0BMX06_IAh8gAL120156svgS8pQzzFlA_lo1XOh-JC3vgv1qj3t8IFQObrzUga2lS1AWPWtV_tG4fIxTt1vbe4MxMMZ-64KQKVlvu8_uNfCBXkUhukBFdWT9xUfxm3zjcWNS-5feoaqojPRx_7J_PEzAdkUGoZi9Rpu_acELrnN4xLc8yVwhocfSXYNonlq6s_fUgWVsTq01cFpP4h0O9NW8eqZWFWqxZbA';
