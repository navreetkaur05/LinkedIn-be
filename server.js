import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import "dotenv/config"

const app = express()

app.use(cors());

app.use(express.json())

app.use("/api/auth", authRouter);

app.use("/api/users", userRouter);

app.use("/api/posts", postRouter);

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connected")
})

app.listen(process.env.PORT, () => {
    console.log("Server started at port 8000")
})

