var jwt = require("jsonwebtoken")

var secret = "jhkjçghglgjgkggjgçjgjgk"


module.exports = function(req,res,next){

    const authToken = req.headers['authorization']
    if(authToken != undefined){

        const bearer = authToken.split('');
        var token = bearer[1]
        //next()
        try{

        var decoded = jwt.verify(token,secret)
            if(decoded.role == 1){
                next()
            }else{
                res.send("Não tem permissão")
                res.status(403)
                return;
            }

            
        }catch(err){

            res.send("Não autenticado")
            res.status(403)
            return;
        }

        
    }else{
        res.send("Não autenticado")
        res.status(403)
        return;
    }
}