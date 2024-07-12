import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// import userRouter from './routes/user.router.js';
import productRouter from './routes/product.routes.js';


// app.use("/api/v1/users", userRouter)
app.use("/api/v1/product", productRouter);


export default app;