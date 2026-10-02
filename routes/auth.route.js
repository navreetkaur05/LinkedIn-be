import express from "express";
import UserModel from "../model/User.model.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const data = req.body;

  const userExist = await UserModel.findOne({
    email: data.email
  });

  if (userExist) {
    return res.json({
      message: "User already exists",
      success: false
    });
  }

  const user = await UserModel.create({
    email: data.email,
    password: data.password
  });

  res.json({
    message: "User registered successfully",
    success: true,
    data: user
  });
});

authRouter.post("/login", async (req, res) => {
  const data = req.body;

  const user = await UserModel.findOne({
    email: data.email,
    password: data.password
  });

  if (!user){
    return res.json({
      message: "Login failed",
      success: false
    })
  }

  res.json({
    message: "Login successful",
    success: true,
    data: user
  });
});

export default authRouter;
