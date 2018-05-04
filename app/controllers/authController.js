const { User } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  signin(req, res) {
    return res.render('auth/signin');
  },
  signup(req, res) {
    return res.render('auth/signup');
  },
  signout(req, res) {
    return req.session.destroy(() => {
      res.redirect('/');
    });
  },

  async register(req, res, next) {
    try {
      const { email, name } = req.body;

      if (email === '' || name === '') {
        req.flash('error', 'Nome e/ou e-Mail não pode estar em branco');
        return res.redirect('back');
      }

      if (await User.findOne({ where: { email } })) {
        req.flash('error', 'E-mail já cadastrado');
        return res.redirect('back');
      }

      const password = await bcrypt.hash(req.body.password, 5);
      await User.create({ ...req.body, password });

      req.flash('success', 'Usuário cadastrado com sucesso');
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  },

  async authenticate(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user || !await bcrypt.compare(password, user.password)) {
        req.flash('error', 'Usuário ou senha inválido');
        return res.redirect('back');
      }

      // Salva na sessão o Usuário
      req.session.user = user;
      return req.session.save(() => {
        res.redirect('app/dashboard');
      });
    } catch (err) {
      return next(err);
    }
  },

};
