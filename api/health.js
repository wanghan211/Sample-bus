/**
 * Health check endpoint for Vercel Serverless / Node.js
 * GET /api/health
 */
export default async function handler(req, res) {
  // Handle CORS
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

  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  const isKeyConfigured = Boolean(ltaKey && ltaKey.trim().length > 0 && ltaKey !== 'YOUR_LTA_DATAMALL_KEY');

  const healthData = {
    status: 'ok',
    service: 'SBS Transit Bus Arrival API Proxy',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime ? process.uptime() : 0),
    environment: {
      platform: process.env.VERCEL ? 'Vercel Serverless' : 'Node.js / Local',
      ltaAccountKeyConfigured: isKeyConfigured,
      keyHint: isKeyConfigured ? `${ltaKey.substring(0, 4)}...${ltaKey.substring(ltaKey.length - 4)}` : 'Not set (set LTA_ACCOUNT_KEY in Vercel environment variables)'
    },
    endpoints: {
      health: '/api/health',
      busArrivalV3: '/api/bus-arrival?BusStopCode=83139&ServiceNo=15',
      ltaSource: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival'
    }
  };

  // Optional live probe to LTA if requested via ?probe=true and key is set
  const url = new URL(req.url, 'http://localhost');
  if (url.searchParams.get('probe') === 'true' && isKeyConfigured) {
    try {
      const probeRes = await fetch('https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139', {
        headers: {
          'AccountKey': ltaKey,
          'accept': 'application/json'
        }
      });
      healthData.ltaProbe = {
        statusCode: probeRes.status,
        statusText: probeRes.statusText,
        reachable: probeRes.ok
      };
    } catch (err) {
      healthData.ltaProbe = {
        reachable: false,
        error: err.message
      };
    }
  }

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(healthData);
}
