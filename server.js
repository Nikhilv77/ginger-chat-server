import express from "express";
import dotenv from 'dotenv'
dotenv.config();


import mongoose from "mongoose";
import AuthRoutes from './Routes/AuthRoutes.js'
import userRoutes from './Routes/UserRoutes.js'
import postRoutes from './Routes/PostRoutes.js'
import UploadRequestRoutes from './Routes/UploadRequest.js'
import chatRouter from './Routes/ChatRoutes.js'
import MessageRouter from './Routes/MessageRoutes.js'
import cors from 'cors'
const app = express();
const corsOptions = {
  origin:'*'
};
app.use(cors(corsOptions));
app.use(express.static('public'))
// app.use('/images',express.static('images'))
app.use(express.json({limit:'20mb',extended:true}))
app.use(express.urlencoded({limit:'20mb',extended:true}));


mongoose.connect(process.env.MONGO_URI).then(()=>{
  app.listen(process.env.PORT,()=>{
    console.log(`Working at Port no ${process.env.PORT}`);
  })
}).catch(error=>console.log(error))


app.use('/auth',AuthRoutes)
app.use('/user',userRoutes)
app.use('/posts',postRoutes)
app.use('/uploadRequest',UploadRequestRoutes)
app.use('/chat', chatRouter) 
app.use('/message', MessageRouter)