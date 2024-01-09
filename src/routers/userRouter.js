import express from 'express';
import { insertUser, updateUser } from '../modules/user/userModule.js';
import { hashPassword } from '../utils/bcrypt.js';
import { newAdminValidation } from '../middlewares/joiValidation.js';
import { responder } from '../middlewares/response.js';
import {v4 as uuidv4} from 'uuid';
import { createNewSession, deleteSession } from '../modules/session/SessionSchema.js';
import { sendEmailVerificaitonLinkEmail, sendEmailVerifiedNotifaction } from '../utils/nodemailer.js';

let router = express.Router();


router.post("/", newAdminValidation, async (req, res, next) => {
    try {
        const {password} = req.body
        //encrypt password  
        req.body.password = hashPassword(password);

        const user = await insertUser(req.body);
        if(user?._id){
            const c = uuidv4()//this must be store in DB
            const token = await createNewSession({token: c, associate: user.email})
            if(token?._id){
                const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?email=${user.email}&c=${c}`
                console.log(url)
                sendEmailVerificaitonLinkEmail({
                    email:user.email,
                    url,
                    fName: user.fName,
                })
            }
            
        }

        user?._id ?
        responder.SUCCESS({res, status: 'success',message: "Check your inbox/span to verify your email"}) :
        responder.ERROR({res, status: 'error', errorCode: 200, message: "Unable to create new user, try again later"})
    } catch (error) {
        if(error.message.includes("E11000 duplicate key error")){
            error.errorCode = 200
            error.message = "The email already exist"
        }
        next(error)
    }
});

//verify use email
router.post("/verify-email", async (req, res, next)=>{
    try {
        const { associate, token } = req.body
        if(associate && token){
            // delete from session
            const session = await deleteSession({ token, associate })
            //if success, then update user status to active
            if(session?._id){
                //update user table
                const user = await updateUser({email: associate}, {status: 'active'})
                

                if(user?._id){
                    //send email notifaction
                    sendEmailVerifiedNotifaction({ email: associate, fName: user.fName })
                    return responder.SUCCESS({res, message: "You email is verified. You may sign in now"})
                }
                
            }
        }
        responder.ERROR({res, message: "Invalid or Expired Link"})
    } catch (error) {
        next(error)
    }
})

export default router