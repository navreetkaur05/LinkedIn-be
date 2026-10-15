import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    likes: {
      type: String,
    },
    comments: {
        type: String
      },
     },
);

const PostModel = mongoose.model("posts", postSchema);

export default PostModel

