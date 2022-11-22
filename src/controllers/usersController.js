const { hash, compare } = require('bcryptjs');
const AppError = require("../utils/appError");
const sqliteConnection = require('../database/sqlite');
class usersController {
  async create(request, response){
    const {name, email, password} = request.body;
    const database = await sqliteConnection();
    const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email]);
    if(checkUserExists){
      const error = new AppError();
      error.message = 'Esse e-mail já está em uso';
      throw error;
    };
    const hashedPassword = await hash(password, 8);
    await database.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    return response.status(201).json();
  };
  async update(request, response){
    const {name, email, password, old_password} = request.body;
    const user_id = request.user.id;
    const database = await sqliteConnection();
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id]);
    if(!user){
      const error = new AppError();
      error.message = 'Usuário não existe';
      throw error;
    };
    const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email]);
    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      const error = new AppError();
      error.message = 'Este e-mail já está em uso';
      throw error;
    };
    user.name = name ?? user.name;
    user.email = email ?? user.email;
    if(password && !old_password){
      const error = new AppError();
      error.message = 'Você precisa informar a senha antiga para definir a nova senha';
      throw error;
    };
    if(password && old_password){
      const checkOldPassword = await compare(old_password, user.password);
      if(!checkOldPassword){
        const error = new AppError();
        error.message = 'A senha antiga não confere';
        throw error;
      };
      user.password = await hash(password, 8);
    };
    await database.run(`
      UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`, [user.name, user.email, user.password, user_id]);
      return response.json();
  };
};
module.exports = usersController;