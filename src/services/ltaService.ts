import { BusArrivalInfo, CrowdDensity, DeckType } from '../data/transitData';

export interface LtaRawBus {
  OriginCode?: string;
  DestinationCode?: string;
  EstimatedArrival?: string;
  Latitude?: string;
  Longitude?: string;
  VisitNumber?: string;
  Load?: 'SEA' | 'SDA' | 'LSD' | string;
  Feature?: 'WAB' | string;
  Type?: 'SD' | 'DD' | 'BD' | string;
  Monitored?: number;
}

export interface LtaServiceArrival {
  ServiceNo: string;
  Operator: string;
  NextBus?: LtaRawBus;
  NextBus2?: LtaRawBus;
  NextBus3?: LtaRawBus;
}

export interface LtaBusArrivalResponse {
  BusStopCode: string;
  Services: LtaServiceArrival[];
  _info?: {
    notice?: string;
    howToConfigure?: string;
  };
}

/**
 * Calculates remaining arrival time in minutes from an ISO timestamp
 */
export function calculateEtaMinutes(isoString?: string): number | 'Arr' | null {
  if (!isoString || isoString.trim() === '') return null;
  const targetTime = new Date(isoString).getTime();
  if (isNaN(targetTime)) return null;

  const now = Date.now();
  const diffMinutes = Math.round((targetTime - now) / 60000);

  if (diffMinutes <= 1) {
    return 'Arr';
  }
  return Math.max(1, diffMinutes);
}

/**
 * Maps LTA DataMall Load code ('SEA', 'SDA', 'LSD') to internal CrowdDensity
 */
export function mapLtaLoad(load?: string): CrowdDensity {
  switch (load) {
    case 'SEA':
      return 'seats';
    case 'SDA':
      return 'standing';
    case 'LSD':
      return 'crowded';
    default:
      return 'seats';
  }
}

/**
 * Maps LTA DataMall Type code ('SD', 'DD', 'BD') to internal DeckType
 */
export function mapLtaDeck(type?: string): DeckType {
  switch (type) {
    case 'DD':
      return 'DD';
    case 'BD':
      return 'BD';
    case 'SD':
    default:
      return 'SD';
  }
}

/**
 * Transforms an LtaRawBus object into a BusArrivalInfo
 */
export function transformLtaBus(bus?: LtaRawBus): BusArrivalInfo | null {
  if (!bus || !bus.EstimatedArrival) return null;
  const eta = calculateEtaMinutes(bus.EstimatedArrival);
  if (eta === null) return null;

  return {
    etaMinutes: eta,
    crowd: mapLtaLoad(bus.Load),
    deck: mapLtaDeck(bus.Type),
    wab: bus.Feature === 'WAB'
  };
}

/**
 * Fetches bus arrival data from our serverless proxy /api/bus-arrival
 * Target LTA Endpoint: https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival
 */
export async function fetchLtaBusArrival(
  busStopCode: string,
  serviceNo?: string
): Promise<LtaBusArrivalResponse | null> {
  try {
    const cleanCode = busStopCode.replace(/^B/, '').trim();
    const params = new URLSearchParams({ BusStopCode: cleanCode });
    if (serviceNo) {
      params.append('ServiceNo', serviceNo.trim());
    }

    const res = await fetch(`/api/bus-arrival?${params.toString()}`);
    if (!res.ok) {
      console.warn(`LTA API response status ${res.status}`);
      return null;
    }
    const data: LtaBusArrivalResponse = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch LTA bus arrival:', error);
    return null;
  }
}

/**
 * Checks system health via /api/health
 */
export async function checkApiHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { status: 'error', message: String(err) };
  }
}
