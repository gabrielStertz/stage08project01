const knex = require('../database/knex');
const AppError = require('../utils/appError');
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController{
  async update(request, response){
    const user_id = request.user.id;
    const avatarFileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex('users')
    .where({id: user_id}).first();

    if(!user){
      let error = new AppError();
      error.message = "Somente usuários autenticados podem mudar o avatar";
      error.statusCode = 401;
      throw error;
    }

    if(user.avatar){
      await diskStorage.deleteFile(user.avatar);  
    };
    
    const fileName = await diskStorage.saveFile(avatarFileName);
    user.avatar = fileName;

    await knex("users").update(user).where({id: user_id});

    return response.json(user);
  };
};

module.exports = UserAvatarController;