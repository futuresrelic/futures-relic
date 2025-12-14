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

    const url = `https://aa-wax-public1.neftyblocks.com/atomicassets/v1/assets?owner=${owner}&collection_name=${collection}&limit=${limit}`;
    console.log('[NFT API] Fetching:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`AtomicAssets API returned ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('[NFT API] Error:', error);
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
