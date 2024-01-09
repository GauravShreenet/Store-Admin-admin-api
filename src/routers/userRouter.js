import express from 'express';
import { insertUser } from '../modules/user/userModule.js';
import { hashPassword } from '../utils/bcrypt.js';
import { newAdminValidation } from '../middlewares/joiValidation.js';
import { responder } from '../middlewares/response.js';
import {v4 as uuidv4} from 'uuid';
import { createNewSession } from '../modules/session/SessionSchema.js';

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
            }
            
        }

        user?._id ?
        responder.SUCCESS({res,message: "Check your inbox/span to verify your email"}) :
        responder.ERROR({res, errorCode: 200, message: "Unable to create new user, try again later"})
    } catch (error) {
        if(error.message.includes("E11000 duplicate key error")){
            error.errorCode = 200
            error.message = "The email already exist"
        }
        next(error)
    }
});

export default router