const AppError = require("../utils/appError")
class usersController {
  create(request, response){
    const {name, email, password} = request.body
    if(!name){
      const appError = new AppError()
      appError.message = "O nome é obrigatório!"
      throw appError
    }
    response.status(201).json({name, email, password})
  }
}
module.exports = usersController