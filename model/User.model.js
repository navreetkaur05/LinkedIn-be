import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: { type: String,},
   headline: { type: String,},
    location: { type: String,},
    profilePhoto: { type: String, },
    coverPhoto: { type: String, },

    skills: [String],

     education: [
      {
        institution: String,
        degree: String,
        startYear: String,
        endYear: String,
        cgpa: String
      }
    ],


});

const UserModel = mongoose.model("users", userSchema);

export default UserModel