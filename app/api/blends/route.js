export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = body.collection;

    console.log(`[BLEND API V4] Fetching ALL blends for: ${collection}`);
    
    const allBlends = [];

    // Helper function to fetch all pages from a contract
    async function fetchAllFromContract(code, scope) {
      const blends = [];
      let hasMore = true;
      let lowerBound = '';
      
      while (hasMore) {
        try {
          const response = await fetch('https://wax.eosrio.io/v1/chain/get_table_rows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              json: true,
              code: code,
              scope: scope,
              table: 'blends',
              limit: 1000,
              lower_bound: lowerBound,
            }),
          });

          const data = await response.json();
          
          if (data.rows && data.rows.length > 0) {
            const collectionBlends = data.rows.filter(blend => blend.collection_name === collection);
            blends.push(...collectionBlends);
            
            // Check if there are more rows
            if (data.more && data.rows.length === 1000) {
              // Get the last blend_id for next query
              lowerBound = data.rows[data.rows.length - 1].blend_id + 1;
            } else {
              hasMore = false;
            }
          } else {
            hasMore = false;
          }
        } catch (error) {
          console.error(`[BLEND API V4] Error fetching from ${code}:`, error.message);
          hasMore = false;
        }
      }
      
      return blends;
    }

    // Fetch from blend.nefty (NEW blends)
    console.log('[BLEND API V4] Fetching from blend.nefty...');
    const neftyBlends = await fetchAllFromContract('blend.nefty', 'blend.nefty');
    
    // Filter hidden blends
    const visibleNeftyBlends = neftyBlends.filter(blend => blend.is_hidden !== 1);
    
    console.log(`[BLEND API V4] blend.nefty: ${visibleNeftyBlends.length} visible blends (${neftyBlends.length} total)`);
    
    // Normalize blend.nefty data
    const normalizedNefty = visibleNeftyBlends.map(blend => {
      const normalizedIngredients = blend.ingredients.map(ing => {
        if (Array.isArray(ing) && ing[0] === "TEMPLATE_INGREDIENT") {
          return {
            template_id: ing[1].template_id?.toString(),
            collection_name: ing[1].collection_name,
            amount: ing[1].amount,
            effect: { type: ing[1].effect?.[1]?.type || 0 }
          };
        }
        return ing;
      });

      return {
        ...blend,
        blend_id: blend.blend_id.toString(),
        is_active: blend.start_time <= Date.now() / 1000 && (blend.end_time === 0 || blend.end_time > Date.now() / 1000),
        ingredients: normalizedIngredients,
        contract: 'blend.nefty'
      };
    });
    
    allBlends.push(...normalizedNefty);

    // Fetch from blenderizerx (OLD blends)
    console.log('[BLEND API V4] Fetching from blenderizerx...');
    const blenderizerBlends = await fetchAllFromContract('blenderizerx', 'blenderizerx');
    
    console.log(`[BLEND API V4] blenderizerx: ${blenderizerBlends.length} blends`);
    
    // Normalize blenderizerx data
    const normalizedBlenderizer = blenderizerBlends.map(blend => ({
      ...blend,
      blend_id: blend.blend_id.toString(),
      is_active: blend.is_active !== false,
      contract: 'blenderizerx',
      ingredients: blend.ingredients || []
    }));
    
    allBlends.push(...normalizedBlenderizer);

    console.log(`[BLEND API V4] TOTAL: ${allBlends.length} blends from both contracts`);
    console.log(`[BLEND API V4] Blend IDs: ${allBlends.map(b => b.blend_id).join(', ')}`);

    return new Response(JSON.stringify(allBlends), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[BLEND API V4] Fatal error:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
