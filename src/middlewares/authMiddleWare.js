import { getSession } from "../modules/session/SessionSchema.js"
import { getAUser } from "../modules/user/userModule.js"
import { verifyAccessJWT } from "../utils/jwt.js"
import { responder } from "./response.js"

export const adminAuth = async(req, res, next) => {
    try {
        //get the accessJWT and verify
        const { authorization } = req.headers
        

        const decoded = verifyAccessJWT(authorization)
        console.log(decoded)

        if(decoded?.email) {
            //check if the token is in the db
            const token = await getSession({ token: authorization, associate: decoded.email})
            if(token?._id){
                //get user
                const user = await getAUser({email: decoded.email})
                if (user?.status === 'active' && user?.role === 'admin' ) {
                    user.password = undefined
                    req.userInfo = user
                    return next();
                }
            }
        }
        
        responder.ERROR({
            res,
            message: 'User unauthorize',
            errorCode: 401,
        })
    } catch (error) {
        next(error)
    }
}