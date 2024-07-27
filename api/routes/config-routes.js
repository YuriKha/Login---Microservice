const userLogin=require('./user');

exports.routesInit = (app) =>{
    
    app.use('/user',userLogin); 

    // default endpoint
    app.all('*',(req,res)=>{ 
    console.log("wrong endpoint");
    res.status(400).json({Msg:"wrong endpoint"});
    });

}