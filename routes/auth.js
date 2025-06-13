import express from 'express';
import supabase from '../supabase/supabaseClient.js';

const router = express.Router();

router.get('/login', async (req, res) => {
  res.render('login.ejs');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log(error.message);
    return res.send('Login failed');
  }

  req.session.user = {
    id: data.user.id,
    email: data.user.email
  };

  res.cookie('token', data.session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  res.redirect('/');
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.redirect('/');
    }
  });

  res.clearCookie('token');
  res.redirect('/');
});

export default router;
