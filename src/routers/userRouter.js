import express from 'express';

let router = express.Router();


router.get("/", async (req, res, next) => {
    try {

        const user = await insertUser(req.body);

        user?._id ?
        res.json({
            status: 'success',
            message: 'The user has been created',
        }):
        res.json({
            status: 'error',
            message: 'Try agin to create the user',
        })
    } catch (error) {
        next(error)
    }
});

export default router