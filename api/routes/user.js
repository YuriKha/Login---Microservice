const router=require('express').Router();

const {
    Login 
}=require('../controller/user');

//------- endpoint for login ------- 
router.post('/login',Login); // ---> POST --> http://localhost:3001/user/login

//----- exports ------
module.exports=router;