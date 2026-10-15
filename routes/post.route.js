import express from "express";
import Post from "../model/Post.model.js";

const postRouter = express.Router();

postRouter.post("/", async (req, res) => {
  const post = await Post.create(req.body);

  res.json({
    message: "Post created successfully",
    post
  });
});


postRouter.get("/posts", async (req, res) => {
  const posts = await Post.find();

  res.json(posts);
});

postRouter.get("/:id", async (req, res) => {
  const post = await Post.findOne(
    
    { 
        _id: req.params.id 
    }

);

  res.json(post);
});


postRouter.put("/:id", async (req, res) => {
  const result = await Post.updateOne(
    {
         _id: req.params.id 
    },
    {
        text: req.body.text
    },
    {
        image: req.body.image
    }
);
  res.json({
    message: "Post updated successfully",
  });
});

postRouter.delete("/:id", async (req, res) => {
  const post = await Post.deleteOne({
    _id: req.params.id 
});

  res.json({ message: "Post deleted successfully" });
});


export default postRouter;