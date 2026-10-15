import express from "express";
import User from "../model/User.model.js";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const user = await User.findOne(
    { 
      _id: req.params.id 
    }
  );
  res.json(user);
});

userRouter.put("/update/:id", async (req, res) => {
  const result = await User.updateOne(
    { _id: req.params.id },
    req.body
  );

  res.json({ message: "Profile updated successfully" });
});

export default userRouter;
