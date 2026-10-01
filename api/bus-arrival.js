/**
 * LTA DataMall v3 Bus Arrival Proxy Endpoint for Vercel Serverless
 * GET /api/bus-arrival?BusStopCode=83139&ServiceNo=15
 * 
 * Target LTA Endpoint:
 * https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode={code}&ServiceNo={svc}
 * 
 * Required Header:
 * AccountKey: process.env.LTA_ACCOUNT_KEY
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, AccountKey'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse query parameters (supports both PascalCase and camelCase)
  // Handles req.query (Vercel) or URL searchParams
  let busStopCode = '';
  let serviceNo = '';

  if (req.query) {
    busStopCode = req.query.BusStopCode || req.query.busStopCode || '';
    serviceNo = req.query.ServiceNo || req.query.serviceNo || '';
  } else if (req.url) {
    const url = new URL(req.url, 'http://localhost');
    busStopCode = url.searchParams.get('BusStopCode') || url.searchParams.get('busStopCode') || '';
    serviceNo = url.searchParams.get('ServiceNo') || url.searchParams.get('serviceNo') || '';
  }

  if (!busStopCode) {
    return res.status(400).json({
      error: 'Missing required parameter: BusStopCode',
      usage: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15',
      sampleEndpoints: [
        '/api/bus-arrival?BusStopCode=83139',
        '/api/bus-arrival?BusStopCode=09022&ServiceNo=14',
        '/api/health'
      ]
    });
  }

  const ltaAccountKey = process.env.LTA_ACCOUNT_KEY;
  const isKeyConfigured = Boolean(
    ltaAccountKey &&
    ltaAccountKey.trim().length > 0 &&
    ltaAccountKey !== 'YOUR_LTA_DATAMALL_KEY'
  );

  // If LTA_ACCOUNT_KEY is configured in Vercel environment variables, fetch from official LTA v3 endpoint
  if (isKeyConfigured) {
    try {
      const ltaBaseUrl = 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival';
      const targetUrl = new URL(ltaBaseUrl);
      targetUrl.searchParams.set('BusStopCode', String(busStopCode).trim());
      if (serviceNo) {
        targetUrl.searchParams.set('ServiceNo', String(serviceNo).trim());
      }

      const ltaResponse = await fetch(targetUrl.toString(), {
        method: 'GET',
        headers: {
          'AccountKey': ltaAccountKey.trim(),
          'accept': 'application/json'
        }
      });

      if (!ltaResponse.ok) {
        const errorText = await ltaResponse.text();
        return res.status(ltaResponse.status).json({
          error: `LTA DataMall API responded with status ${ltaResponse.status}`,
          statusText: ltaResponse.statusText,
          details: errorText,
          hint: ltaResponse.status === 401 ? 'Check if LTA_ACCOUNT_KEY in Vercel environment is valid.' : undefined
        });
      }

      const data = await ltaResponse.json();
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=20'); // LTA recommends ~20s refresh
      res.setHeader('X-Data-Source', 'LTA-DataMall-v3-Live');
      return res.status(200).json(data);
    } catch (err) {
      return res.status(502).json({
        error: 'Failed to fetch from LTA DataMall service',
        message: err.message
      });
    }
  }

  // Graceful Fallback if LTA_ACCOUNT_KEY is not yet added in Vercel environment variables
  // Generates real-time ISO dates matching the exact LTA DataMall v3 schema format
  const now = Date.now();
  const getIso = (minutesAhead) => new Date(now + minutesAhead * 60000).toISOString();

  // If specific service is queried, return targeted response
  const requestedService = serviceNo ? String(serviceNo).trim() : '14';

  const mockServices = [
    {
      ServiceNo: requestedService,
      Operator: requestedService === '190' ? 'SMRT' : requestedService === '78' ? 'TTS' : 'SBST',
      NextBus: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: getIso(1),
        Monitored: 1,
        Latitude: '1.304039',
        Longitude: '103.831876',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      },
      NextBus2: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: getIso(8),
        Monitored: 1,
        Latitude: '1.308240',
        Longitude: '103.829623',
        VisitNumber: '1',
        Load: 'SDA',
        Feature: 'WAB',
        Type: 'SD'
      },
      NextBus3: {
        OriginCode: '10009',
        DestinationCode: '45009',
        EstimatedArrival: getIso(17),
        Monitored: 1,
        Latitude: '1.312829',
        Longitude: '103.821190',
        VisitNumber: '1',
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'DD'
      }
    }
  ];

  if (!serviceNo) {
    mockServices.push(
      {
        ServiceNo: '65',
        Operator: 'SBST',
        NextBus: {
          OriginCode: '14009',
          DestinationCode: '75009',
          EstimatedArrival: getIso(3),
          Monitored: 1,
          Latitude: '1.305100',
          Longitude: '103.830500',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'DD'
        },
        NextBus2: {
          OriginCode: '14009',
          DestinationCode: '75009',
          EstimatedArrival: getIso(12),
          Monitored: 1,
          Latitude: '1.298000',
          Longitude: '103.820000',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'SD'
        },
        NextBus3: {
          OriginCode: '14009',
          DestinationCode: '75009',
          EstimatedArrival: getIso(24),
          Monitored: 1,
          Latitude: '1.285000',
          Longitude: '103.810000',
          VisitNumber: '1',
          Load: 'LSD',
          Feature: 'WAB',
          Type: 'DD'
        }
      },
      {
        ServiceNo: '124',
        Operator: 'SBST',
        NextBus: {
          OriginCode: '52009',
          DestinationCode: '14009',
          EstimatedArrival: getIso(0.5),
          Monitored: 1,
          Latitude: '1.304200',
          Longitude: '103.832000',
          VisitNumber: '1',
          Load: 'SDA',
          Feature: 'WAB',
          Type: 'SD'
        },
        NextBus2: {
          OriginCode: '52009',
          DestinationCode: '14009',
          EstimatedArrival: getIso(10),
          Monitored: 1,
          Latitude: '1.311000',
          Longitude: '103.835000',
          VisitNumber: '1',
          Load: 'SEA',
          Feature: 'WAB',
          Type: 'SD'
        },
        NextBus3: {
          OriginCode: '',
          DestinationCode: '',
          EstimatedArrival: '',
          Monitored: 0,
          Latitude: '',
          Longitude: '',
          VisitNumber: '',
          Load: '',
          Feature: '',
          Type: ''
        }
      }
    );
  }

  const sampleResponse = {
    'odata.metadata': 'http://datamall2.mytransport.sg/ltaodataservice/$metadata#BusArrivalv3/@Element',
    BusStopCode: String(busStopCode),
    Services: mockServices,
    _info: {
      notice: 'LTA_ACCOUNT_KEY is not yet configured in environment variables. Showing simulated LTA v3 data.',
      howToConfigure: 'Add LTA_ACCOUNT_KEY in Vercel project Settings -> Environment Variables to connect to live LTA DataMall v3.',
      targetEndpoint: `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}${serviceNo ? `&ServiceNo=${serviceNo}` : ''}`
    }
  };

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Data-Source', 'Simulated-LTA-v3-Fallback');
  return res.status(200).json(sampleResponse);
}
