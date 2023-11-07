//const { index } = require("./HomeController");
var User = require("../models/User")
var PasswordToken = require("../models/PasswordToken")
var jwt = require("jsonwebtoken")
var bcrypt = require("bcrypt")

var secret = "jhkjçghglgjgkggjgçjgjgk"


class UserController{

    async index(req,res){
       var users = await  User.findAll();
       res.json(users)
    }


    async findUser(req,res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.json({})
            res.status(404)
        }else{
            res.json(user)
            res.status(200)
        }
    }

    async create(req,res){
        
        var {name, email, password} = req.body;
        if(email == undefined || email =='' || email ==' '){
            res.json({err: "Email invalido!"})
            res.status(400)
            return;
        }
        if(name == undefined){                      //Validações
            res.json({err: "Nome invalido!"})
            res.status(400)
            return;
        }
        if(password == undefined){
            res.json({err: "Senha invalida!"})
            res.status(400)
            return;
        }
        
        var emailExists = await User.findEmail(email)

        if(emailExists){
            res.json({err: "Email já cadastrado!"})
            res.status(406)
            return;
        }

        await User.new(email,password,name)

        res.status(200)
        res.send("Tudo ok!")
    }

    async edit(req,res){
        var {id,name,role,email} = req.body;
        var result = await User.update(id,email,name,role)

        if(result != undefined){
            if(result.status){
                res.send("tudo ok!")
                res.status(200)
            }else{
                res.send(result.err)
                res.status(406)
            }

        }else{
            res.send("Ocorreu um erro no servidor!")
            res.status(406)
        }

    }


    async remove(req,res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.send("ok")
            res.status(200)
        }else{
            res.send(result.err)
            res.status(406)
        }
    }

    async recoverPassword(req,res){
        var email = req.body.email;
        var result = await PasswordToken.create(email);

        if(result.status){
            res.send(""+result.token)
            res.status(200)
        }else{
            res.send(result.err)
            res.status(406)
        }
    }

    async changePassword(req,res){
        var token = req.body.token;
        var password = req.body.password;

        var isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status){

           await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token)
           res.send("Senha alterada!")
           res.status(200)

        }else{
            res.send("Token invalido")
            res.status(406)
        }
    }


    async login(req,res){
        var {email,password} = req.body;
        var user = await User.findByEmail(email);

        if(user != undefined){
           var resultado = await  bcrypt.compare(password,user.password)
          
           if(resultado){

            var token = jwt.sign({ email: user.email, role: user.role }, secret);
            res.status(200)
            res.token({token: token})

           }else{
               res.status(406)
               res.json({err: 'Senha incorreta!'})
            
           }

        }else{
            //res.status(406)
           res.json({status: false, err: "Usuário não existe!"})
           
        }
    }
}


module.exports = new UserController();