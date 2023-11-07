class HomeController{

    async index(req, res){
        res.send("App rodando");
    }

    async validate(req,res){
        res.send('okay')
    }

}

module.exports = new HomeController();