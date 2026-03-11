import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error(`is.gd error: ${response.status}`);
    }

    const shortened = await response.text();
    return res.status(200).send(shortened);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to shorten URL' });
  }
}
