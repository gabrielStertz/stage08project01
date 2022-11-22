const { verify } = require("jsonwebtoken");
const AppError = require("../utils/appError");
const authConfig = require("../Config/auth");

function ensureAuthenticated(req, res, next){
  const authHeader = req.headers.authorization;

  if(!authHeader){
    const error = new AppError();
    error.message = "JWT Token não informado";
    error.statusCode = 401;
    throw error;
  };

  const [, token] = authHeader.split(' ');

  try{
    const {sub: user_id} = verify(token, authConfig.jwt.secret);

    req.user = {
      id: Number(user_id)
    };
    
    return next();
  } catch{
    const error = new AppError();
    error.message = "JWT Token inválido";
    error.statusCode = 401;
    throw error;
  };
};

module.exports = ensureAuthenticated;