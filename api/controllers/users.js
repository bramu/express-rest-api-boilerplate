const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');
// const _ = require('lodash');

const UserController = () => {
  const register = async (req, res) => {
    const { body } = req;

    const { name, email, password } = body;

    const userDetails = await User.getByEmail(email);

    if (userDetails) {
      return res.status(200).json({
        msg: 'Email Already Exists',
      });
    }

    const opts = {
      fullName: name,
      userEmail: email,
      password,
    };

    const user = await User.create(opts);

    const token = '';
    return res.status(200).json({
      msg: 'User Successfully Created',
      data: token,
    });

    // if (body.password === body.password2) {
    //   try {
    //     const user = await User.create({
    //       email: body.email,
    //       password: body.password,
    //     });
    //     const token = authService().issue({
    //       id: user.id,
    //     });

    //     return res.status(200).json({
    //       token,
    //       user,
    //     });
    //   } catch (err) {
    //     // console.log(err);
    //     return res.status(500).json({
    //       msg: 'Internal server error',
    //     });
    //   }
    // }

    // return res.status(400).json({
    //   msg: "Bad Request: Passwords don't match",
    // });
  };

  const login = async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
      try {
        const user = await User.findOne({
          where: {
            userEmail: email,
          },
        });

        if (!user) {
          return res.status(400).json({
            msg: 'Bad Request: User not found',
          });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({
            id: user.id,
            fullName: user.fullName,
            userEmail: user.userEmail,
            userType: user.userType,
          });

          return res.status(200).json({
            msg: 'loggedIn',
            token,
          });
        }
        return res.status(401).json({
          msg: 'Unauthorized',
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          msg: 'Internal server error',
        });
      }
    }
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, (err) => {
      if (err) {
        return res.status(401).json({
          isvalid: false,
          err: 'Invalid Token!',
        });
      }

      return res.status(200).json({
        isvalid: true,
      });
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({
        users,
      });
    } catch (err) {
      // console.log(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const helloWorld = async (req, res) => {
    console.log('Welcome!!');

    try {
      const data = {};
      // return res.status(200).json({ "Msg":"Hello World" });
      // const rohit = await User.findOne({ where: { email: 'rohit@blueberrylabs.com' } });
      data.rohit = {
        email: 'rohot@',
      };
      data.layout = 'layouts/new-layout.ejs';
      data.firstfold = 'home';
      return res.render('home.ejs', data);
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  return {
    register,
    login,
    validate,
    getAll,
    helloWorld,
  };
};

module.exports = UserController;
