export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'futuresrelic';
    
    console.log(`[TEMPLATES API] Fetching all templates for ${collection}...`);
    
    const allTemplates = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages of templates
    while (hasMore && page <= 30) { // Safety limit of 30 pages (30,000 templates max)
      try {
        const response = await fetch(
          `https://aa-wax-public1.neftyblocks.com/atomicassets/v1/templates?collection_name=${collection}&page=${page}&limit=1000&order=desc&sort=created`
        );

        if (!response.ok) {
          console.error(`[TEMPLATES API] Error fetching page ${page}: ${response.status}`);
          break;
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const templates = data.data.map(template => ({
            template_id: template.template_id,
            name: template.immutable_data?.name || template.name || `Template ${template.template_id}`,
            img: template.immutable_data?.img || template.img || '',
            max_supply: template.max_supply,
            issued_supply: template.issued_supply,
          }));
          
          allTemplates.push(...templates);
          console.log(`[TEMPLATES API] Page ${page}: ${templates.length} templates (total: ${allTemplates.length})`);
          
          // Check if there are more pages
          if (data.data.length < 1000) {
            hasMore = false;
          } else {
            page++;
          }
        } else {
          hasMore = false;
        }
      } catch (error) {
        console.error(`[TEMPLATES API] Error on page ${page}:`, error);
        hasMore = false;
      }
    }

    console.log(`[TEMPLATES API] SUCCESS - Loaded ${allTemplates.length} total templates`);

    return new Response(JSON.stringify({
      success: true,
      count: allTemplates.length,
      templates: allTemplates,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[TEMPLATES API] Fatal error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      templates: [],
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
