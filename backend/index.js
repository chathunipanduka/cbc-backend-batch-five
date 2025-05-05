import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use(
    (req,res,next)=>{
        const tokenString=req.header("Authorization")
        if (tokenString != null){
            const token = tokenString.replace("Bearer ","")
            jwt.verify(token,"cbc-btch-five@2025",(err,decoded)=>{
                if(decoded != null){
                    console.log(decoded)
                    req.user = decoded
                    next()
        }   else{
            console.log("Invalid Token")
            res.status(403).json({
                message:"Invalid Token"
            })    
        }     
        }
    )
        }else{
            next()
        }

}
)

mongoose.connect("mongodb+srv://admin:123@cluster0.kqs03ld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Database connected");
}).catch(()=>{
    console.log("Connection Failed");
})

app.use("/api/products" ,productRoutes)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)




app.listen(3000, 
    () => {
    console.log('Server is running on port 3000');
    }
);