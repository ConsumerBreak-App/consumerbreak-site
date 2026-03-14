export default async (req, context) => {
  const url = new URL(req.url);
  const file = url.searchParams.get('file');
  
  const allowed = ['hero','pitchbreak','spectral','hybrid','nftopia','breakery','community'];
  if (!file || !allowed.includes(file)) {
    return new Response(JSON.stringify({error:'not found'}), {status:404});
  }

  try {
    const base = new URL(req.url).origin;
    const r = await fetch(`${base}/_data/${file}.json`);
    if (!r.ok) return new Response('{}', {status:200});
    const data = await r.text();
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch(e) {
    return new Response('{}', {status:200});
  }
}

export const config = {
  path: '/api/data'
}
