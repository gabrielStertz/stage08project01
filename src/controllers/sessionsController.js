const knex = require('../database/knex');
const AppError = require('../utils/appError');
const { compare } = require("bcryptjs");
const authConfig = require('../Config/auth');
const { sign } = require('jsonwebtoken');

class SessionsController {
  async Create(req,res){
    const {email, password} = req.body;

    const user = await knex("users").where({email}).first();

    if(!user){
      let error = new AppError();
      error.message = "E-mail e/ou senha incorreta";
      error.statusCode = 401;
      throw error;
    };

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched){
      let error = new AppError();
      error.message = "E-mail e/ou senha incorreta";
      error.statusCode = 401;
      throw error;
    };

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    });

    return res.json({ user, token });
  };
};

module.exports = SessionsController;