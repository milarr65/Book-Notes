import supabase from '../supabaseClient.js';

export async function verifyUser(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ error: 'Missing token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) return res.status(401).json({ error: 'Invalid token' });

  req.user = user;
  next();
}
