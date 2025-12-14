export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const collection = searchParams.get('collection_name');
    const limit = searchParams.get('limit') || '1000';

    if (!owner) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Owner parameter is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try multiple API endpoints with proper headers
    const apiEndpoints = [
      'https://wax.api.atomicassets.io/atomicassets/v1/assets',
      'https://aa.dapplica.io/atomicassets/v1/assets',
      'https://aa-wax-public1.neftyblocks.com/atomicassets/v1/assets',
    ];

    const fetchOptions = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FuturesRelic/1.0)',
        'Accept': 'application/json',
      },
    };

    let lastError = null;

    // Try each endpoint until one works
    for (const endpoint of apiEndpoints) {
      try {
        const url = `${endpoint}?owner=${owner}&collection_name=${collection}&limit=${limit}`;
        console.log('[NFT API] Trying:', endpoint);

        const response = await fetch(url, fetchOptions);

        if (response.ok) {
          const data = await response.json();
          console.log('[NFT API] Success with:', endpoint);

          return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, max-age=0',
            },
          });
        } else {
          lastError = `${endpoint} returned ${response.status}`;
          console.warn('[NFT API] Failed:', lastError);
        }
      } catch (err) {
        lastError = err.message;
        console.warn('[NFT API] Error with', endpoint, ':', err.message);
        continue;
      }
    }

    // All endpoints failed
    throw new Error(`All API endpoints failed. Last error: ${lastError}`);

  } catch (error) {
    console.error('[NFT API] Fatal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
