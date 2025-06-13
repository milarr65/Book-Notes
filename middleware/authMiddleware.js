
export default function checkAuth(req, res, next) {
  if (!req.cookies.token) {
    return res.render('error', { errorMessage: "Forbiden. You must be logged in.", status:403 });
  }
  next();
};
