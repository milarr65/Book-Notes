
export default function checkAuth(req, res, next) {
  if (!req.cookies.token) {
    return res.status(403).send('Forbidden: You must be logged in.');
  }
  next();
};
