const express = require('express');

const routes = express.Router();
const authMiddleware = require('./middlewares/auth');
const guestMiddleware = require('./middlewares/guest');

const authController = require('./controllers/authController');
const dashboardController = require('./controllers/dashboardController');
const projectController = require('./controllers/projectController');
const sectionController = require('./controllers/sectionController');

// Middleware com Rota para tratar as mensagens
routes.use((req, res, next) => {
  res.locals.flashSuccess = req.flash('success');
  res.locals.flashError = req.flash('error');
  next();
});

// Essas 2 rotas get passa pelo middleware guest
// caso esteja autenticado envia para rota /app/dashboard
routes.get('/', guestMiddleware, authController.signin);
routes.get('/signup', guestMiddleware, authController.signup);
routes.get('/signout', authController.signout);
routes.post('/register', authController.register);
routes.post('/authenticate', authController.authenticate);

// Todas as rotas /app antes passa pelo middleware
// para verificar se esta authenticado.
routes.use('/app', authMiddleware);

// Rotas Dashboard
routes.get('/app/dashboard', dashboardController.index);

// Rotas Projects
routes.get('/app/projects/:id', projectController.show);
routes.post('/app/projects/create', projectController.store);
routes.delete('/app/projects/:id', projectController.destroy);

// Rotas Sections
routes.get('/app/projects/:projectId/sections/:id', sectionController.show);
routes.post('/app/projects/:projectId/sections/create', sectionController.store);
routes.put('/app/projects/:projectId/sections/:id', sectionController.update);
routes.delete('/app/projects/:projectId/sections/:id', sectionController.destroy);

// Qualquer rota não encontrada para exibir a view 404
routes.use((req, res) => {
  res.render('errors/404');
});

// Ultima rota com o erro ocorrido
// com status 500 Erro no servidor
routes.use((err, req, res, _next) => {
  // _next colocado o _ quando a variavel é necessaria e nao utilizada
  // criada rule no .eslintrc para evitar o warn

  res.status(err.status || 500);

  return res.render('errors/index', {
    message: err.message,
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});

module.exports = routes;
