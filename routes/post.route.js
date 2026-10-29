import express from "express";
import Post from "../model/Post.model.js";
import upload from "../middleware/upload.js"

const postRouter = express.Router();

postRouter.post("/", upload.single("image"), async (req, res) => {
  const post = await Post.create({
    userId: req.body.userId,
    text: req.body.text,
    image: req.file ? `/uploads/${req.file.filename}` : ""
  });

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


postRouter.put("/:id", upload.single("image"), async (req, res) => {
  
  const data = {
    text: req.body.text
  };

  if (req.file) {
    data.image = `/uploads/${req.file.filename}`;
  }
  
  const result = await Post.updateOne(
    {
         _id: req.params.id
    },
         data
    
   
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