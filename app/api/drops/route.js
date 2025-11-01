export async function POST(request) {
  try {
    const body = await request.json();
    const collection = body.collection;

    const response = await fetch('https://wax.greymass.com/v1/chain/get_table_rows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: true,
        code: 'neftyblocksd',
        scope: 'neftyblocksd',
        table: 'drops',
        limit: 1000,
        index_position: 2,
        key_type: 'i64',
        lower_bound: collection,
        upper_bound: collection,
      }),
    });

    const data = await response.json();
    const filtered = data.rows ? data.rows.filter((drop) => drop.collection_name === collection) : [];
    
    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
