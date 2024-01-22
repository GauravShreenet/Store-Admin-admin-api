import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8000

connectDb();
//middleware
app.use(cors())
app.use(express.json())
app.use(morgan("tiny"));

import userRouter from './src/routers/userRouter.js';
import categoryRouter from './src/routers/categoryRouter.js'
import productRouter from './src/routers/productRouter.js'
import { connectDb } from './src/config/dbConfig.js';
import { adminAuth } from './src/middlewares/authMiddleWare.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", adminAuth, categoryRouter);
app.use("/api/v1/products", adminAuth, productRouter);

app.get("/", (req, res)=>{
    res.json({
        status: 'success',
        message: 'server is live'
    })
})

app.use((error, req, res, next)=> {
    const errorCode = error.errorCode || 500

    res.status(errorCode).json({
        status: 'error',
        message: error.message,
    })
})

app.listen(PORT, (error)=>{
    error ? console.log(error) : console.log(`Server is running at http://localhost:${PORT}`);
})

