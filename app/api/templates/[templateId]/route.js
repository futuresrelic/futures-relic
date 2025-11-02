const templateCache = new Map();

export async function GET(request, { params }) {
  try {
    const templateId = params.templateId;
    
    // Check cache first
    if (templateCache.has(templateId)) {
      console.log(`[TEMPLATE API] Cache hit for ${templateId}`);
      return new Response(JSON.stringify(templateCache.get(templateId)), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`[TEMPLATE API] Fetching template ${templateId}`);
    
    const response = await fetch(
      `https://aa-wax-public1.neftyblocks.com/atomicassets/v1/templates/futuresrelic/${templateId}`
    );

    if (!response.ok) {
      console.error(`[TEMPLATE API] Failed to fetch ${templateId}: ${response.status}`);
      return new Response(JSON.stringify({ error: 'Template not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const result = {
      template_id: templateId,
      name: data.data?.immutable_data?.name || data.data?.name || `Template ${templateId}`,
      img: data.data?.immutable_data?.img || data.data?.img || '',
    };

    // Cache for 1 hour
    templateCache.set(templateId, result);
    setTimeout(() => templateCache.delete(templateId), 3600000);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[TEMPLATE API] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch template' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}