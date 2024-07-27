const user=require('../models/user');

const bcrypt=require('bcryptjs'); 

const axios = require('axios');

//----------------- export -------------------------
module.exports={  
    // POST  http://localhost:3001/user/login
    // {
    //     "email": "some_Email@gmail.com",
    //     "password": "123"
    // }
    Login:async (req,res)=>{
        const email = req.body.email.toLowerCase();
        const password = req.body.password;
        console.log("the req.body that you just received: ");
        console.table(req.body);
        try {
            const userfound = await user.find({Email: email});
            if(userfound.length === 0){
                console.log("the email: " + email + " NOT found in the database");
                return res.status(404).json({Msg:"the email: " + email + " NOT found in the database"});
            }
            else{
                try {
                    const passwordStatus = await bcrypt.compare(password, userfound[0].Password);                 
                    if(!passwordStatus){
                        console.log("wrong password try again ");
                        return res.status(401).json({Msg:"wrong password try again "});
                    }else{
                        const payload = {               
                            ID: userfound[0].ID,    
                            firstName: userfound[0].FirstName,
                            lastName: userfound[0].LastName,
                            email: userfound[0].Email,
                            phone: userfound[0].Phone,
                            joined: userfound[0].Joined 
                        }; 
                        if (email === process.env.Admin1 || email === process.env.Admin2 )
                        {
                            try {   
                                //    get Token via API :
                                const tokenAPI = await axios({
                                    method: 'post',
                                    url: 'http://localhost:3003/user/token',
                                    data: {
                                        userType: 'admin',
                                        payload
                                    }
                                  });      
                                //   const mailAPI = await axios({
                                //     method: 'post',
                                //     url: 'http://localhost:3004/mail/send',
                                //     data: {
                                //         payload
                                //     }
                                //   }); 
                                if(tokenAPI.status === 200){
                                    const admintoken = tokenAPI.data.admintoken;
                                    console.log("welcome back admin " + admintoken);
                                    return res.status(200).json({Msg:"welcome back admin ", admintoken});
                                }
                                else{
                                    console.log("could not generate Token: ",error);
                                    return res.status(500).json({Msg:"could not generate Token: ",error});
                                }
                            } catch (error) {
                                console.log("could not generate Token: ",error);
                                return res.status(500).json({Msg:"could not generate Token: ",error});
                            }          
                        }
                        else
                        {
                            try {
                                //    get Token via API :
                                const tokenAPI = await axios({
                                    method: 'post',
                                    url: 'http://localhost:3003/user/token',
                                    data: {
                                        userType: 'user',
                                        payload
                                    }
                                }); 
                                if(tokenAPI.status === 200){
                                    const usertoken = tokenAPI.data.usertoken
                                    console.log("welcome back user " + usertoken);
                                    return res.status(200).json({Msg:"welcome back user ", usertoken});
                                }else{
                                    console.log("could not generate Token: ",error);
                                    return res.status(500).json({Msg:"could not generate Token: ",error});
                                }
                            } catch (error) {
                                console.log("could not generate Token: ",error);
                                return res.status(500).json({Msg:"could not generate Token: ",error});
                            }
                        } 
                    }
                } catch (error) {
                    console.log("could not compare the password at the moment ",error);
                    return res.status(500).json({Msg:"could not compare the password at the moment ",error});
                }
            }
        } catch (error) {
            console.log("could NOT search in the database at the moment: ",error);
            return res.status(500).json({Msg:"could NOT search in the database at the moment: ",error});
        }
    }
}

// Promis  - שיטת ה 
// Login:(req,res)=>{ 
//     const Email = req.body.email.toLowerCase();
//     const Password = req.body.Password;
//     // אפשר להוסיף שיחפש גם אימייל זהה במאגר עם האופרטור או
//     user.find({Email:Email}).then((userfound)=>{ // נחפש אם יש שם משתמש זה בבסיס נתונים שלי
//         if(userfound.length === 0) 
//         {
//             // במידה ואימייל לא נמצאה בדאטא נשלח הודעה שלא נמצאה
//             console.log("This email --> " + Email + " <-- was NOT found in database"); // נדפיס בצד שרת
//             return res.status(406).json({Msg:"This email --> " + Email + " <-- was NOT found in database"}); // נשלח הודעה לצד לקוח
//         }
//         else // אחרת תשווה את ההצפנה של הסיסמא אם מה שיש לי בבסיס נתונים 
//         {
//             if(userfound.length>1) // במידה ונמצאה יותר מאחד
//             {
//                 // הודעה בשבילנו שיש לנו כפילות באימייל בדאטה שלנו
//                 console.log("you have more then 1 of this Email in the Database " +Email); // נדפיס בצד שרת
//             }
//             // --- ההשוואה של ההצפנות מה שיש לי בבסיס נתונים מול מה מה שיש לי עכשיו----
//             bcrypt.compare(Password,userfound[0].Password).then((status)=>{ // פה נשווה את הסיסמאות
//                 if(!status) // אם הסיסמא לא תואמת נחזיר שגיאה
//                 {
//                     // אם הגעתי לפה שם משתמש נכון אבל סיסמא לא נכונה
//                     console.log("the password is wrong try again "); // נדפיס בצד שרת
//                     return res.status(406).json({Msg:"the password is wrong try again "}); // נשלח הודעה לצד לקוח
//                 }
//                 else //  אחרת כל הנתונים תואמים לבסיס נתונים וצריך להכניס את המשתמש
//                 {    
//                     console.log("welcome back " + userfound[0].Fname); // נדפיס בצד שרת
//                     return res.status(200).json({Msg:"welcome back " + userfound[0].Fname}); // נחזיר תוקן והודעה             
//                 } 
//             }).catch((error)=>{
//                 // התרחשה שגיאה בזמן השוואת הסיסמאות 
//                 console.log("could not compare the passwords: "  + error); // נדפיס בצד שרת
//                 return res.status(406).json({Msg:"could not compare the passwords: " ,error}); // נשלח הודעה לצד לקוח     
//             })
//         }
//     }).catch((error)=>{
//         // במידה והתרחשה טעות
//         console.log("could not search in database: "  + error); // נדפיס בצד שרת
//         return res.status(406).json({Msg:"could not search in database: " ,error}); // נשלח הודעה לצד לקוח            
//     });
// }