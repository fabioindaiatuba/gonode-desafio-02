// Middleware para interceptar todas as rotas /app
// e verificar se esta autenticado
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  req.flash('error', 'Não autorizado');
  return res.redirect('/');
};
