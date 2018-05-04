// Middleware para interceptar as rotas /signin /signup
// e verificar se esta autenticado manda pro dashboard
module.exports = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  return res.redirect('/app/dashboard');
};
