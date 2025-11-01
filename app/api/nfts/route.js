export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const collection = searchParams.get('collection_name');
  const limit = searchParams.get('limit') || '1000';

  try {
    const url = `https://aa-wax-public1.neftyblocks.com/atomicassets/v1/assets?owner=${owner}&collection_name=${collection}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
