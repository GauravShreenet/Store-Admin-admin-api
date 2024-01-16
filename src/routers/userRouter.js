import express from 'express';
import { getAUser, getAdminPasswordById, insertUser, updateUser } from '../modules/user/userModule.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';
import { newAdminValidation, resetPasswordValidation } from '../middlewares/joiValidation.js';
import { responder } from '../middlewares/response.js';
import { v4 as uuidv4 } from 'uuid';
import { createNewSession, deleteSession } from '../modules/session/SessionSchema.js';
import { passwordUpdateNotification, sendEmailVerificaitonLinkEmail, sendEmailVerifiedNotifaction, sendOtpEmail } from '../utils/nodemailer.js';
import { getJwts } from '../utils/jwt.js';
import { adminAuth, refreshAuth } from '../middlewares/authMiddleWare.js';
import { otpGenerator } from '../utils/randomGenerator.js';

let router = express.Router();


router.post("/", newAdminValidation, async (req, res, next) => {
    try {
        const { password } = req.body
        //encrypt password  
        req.body.password = hashPassword(password);

        const user = await insertUser(req.body);
        if (user?._id) {
            const c = uuidv4()//this must be store in DB
            const token = await createNewSession({ token: c, associate: user.email })
            if (token?._id) {
                const url = `${process.env.CLIENT_ROOT_DOMAIN}/verify-email?email=${user.email}&c=${c}`
                console.log(url)
                sendEmailVerificaitonLinkEmail({
                    email: user.email,
                    url,
                    fName: user.fName,
                })
            }

        }

        user?._id ?
            responder.SUCCESS({ res, status: 'success', message: "Check your inbox/span to verify your email" }) :
            responder.ERROR({ res, status: 'error', errorCode: 200, message: "Unable to create new user, try again later" })
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            error.errorCode = 200
            error.message = "The email already exist"
        }
        next(error)
    }
});

//verify use email
router.post("/verify-email", async (req, res, next) => {
    try {
        const { associate, token } = req.body
        if (associate && token) {
            // delete from session
            const session = await deleteSession({ token, associate })
            //if success, then update user status to active
            if (session?._id) {
                //update user table
                const user = await updateUser({ email: associate }, { status: 'active' })


                if (user?._id) {
                    //send email notifaction
                    sendEmailVerifiedNotifaction({ email: associate, fName: user.fName })
                    return responder.SUCCESS({ res, message: "You email is verified. You may sign in now" })
                }

            }
        }
        responder.ERROR({ res, message: "Invalid or Expired Link" })
    } catch (error) {
        next(error)
    }
})

router.post("/sign-in", async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            // 1. get user by email

            const user = await getAUser({ email })
            // 2. verify password match
            if(user?.status === 'inactive'){
                return responder.ERROR({
                    res,
                    message: "Your account has not been verified. Please verify your account and login again."
                })
            }
            if (user?._id) {
                const isPassMatched = comparePassword(password, user.password)

                if (isPassMatched) {
                    // 3. create and store tokens
                    //4. response token
                    const jwts = await getJwts(email)
                    return responder.SUCCESS({ res, message: "Login Successfully", jwts })
                }
            }



        }
        responder.ERROR({ res, message: "Invalid Login" })
    } catch (error) {
        next(error)
    }
})

router.get("/", adminAuth, (req, res, next)=>{
    try {
        responder.SUCCESS({res, message: "Here is the user data", user: req.userInfo})
    } catch (error) {
        next(error)
    }
})

router.get("/get-accessjwt", refreshAuth)

// logout
router.post("/logout", async(req, res, next)=> {
    try {
        const { accessJWT, _id } = req.body;
        accessJWT && (await deleteSession({
            token: accessJWT,
        }))

        await updateUser({_id}, {refreshJWT: "" })

        responder.SUCCESS({
            res,
            message: "User logged out successfully"
        })
    } catch (error) {
        next(error)
    }
})

//otp request
router.post("/request-otp", async(req, res, next) => {
    try {
        // check if user exist
        const { email } = req.body
        if(email.includes("@")){
            const user = await getAUser({email})

            if(user._id){
                const otp = otpGenerator()
                console.log(otp)
                const otpSession = await createNewSession({
                    token: otp,
                    associate: email
                })
                if(otpSession?._id){
                    sendOtpEmail({
                        fName: user.fName,
                        email,
                        otp
                    })
                }
            }
        }
        // create new otp

        // store otp and store it in session table

        // sen email to the user

        // response user

        responder.SUCCESS({
            res,
            message: "If your email is found in the system, we will send otp to your email please check your Junk/Spam folder too",
        })

    } catch (error) {
        next(error)
    }
})

// password reset
router.patch("/", resetPasswordValidation, async(req, res, next) => {
    try {
        // check if user exist
        const { email, otp, password } = req.body
        
        const session = await deleteSession({
            token: otp,
            associate: email
        })

        if (session?._id) {
            // check what is the expire time
            const hashPass = hashPassword(password)

            const user = await updateUser({email}, {password: hashPass})

            if(user?._id){
                passwordUpdateNotification({
                    fName: user.fName,
                    email,
                })
                
                return responder.SUCCESS({
                    res,
                    message: "Your password has been updated, you may login now",
                })
            }
        }



        responder.ERROR({
            res,
            message: "Invalid token, unable to rest your password, try again later",
        })

    } catch (error) {
        next(error)
    }
})

//password update
router.patch("/password", adminAuth, async(req, res, next)=> {
    try {
        //get user info
        const user = req.userInfo
        const {oldPassword, newPassword} = req.body

        // get password from db by user id
        const {password} = await getAdminPasswordById(user._id)

        // match the old pass with db pass
        const isMatched = comparePassword(oldPassword, password) 
        // encrypt new pass
        if(isMatched) {
            const newHashPass = hashPassword(newPassword)
            //update user table with new pass
            const updatedUser = await updateUser({_id: user._id}, {password: newHashPass})
            if(updatedUser?._id){
                passwordUpdateNotification({
                    fName: user.fName,
                    email: updatedUser.email,
                })
                return responder.SUCCESS({
                    res,
                    message: "Your Password has been updated"
                })
            }
        }
        
       
        //send email notification
        responder.ERROR({
            res,
            message: "Unable to update the password"
        })
    } catch (error) {
        next(error)
    }
})

export default router