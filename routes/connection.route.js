import express from "express"
import mongoose from "mongoose"
import ConnectionModel from "../model/Connection.model.js";
import UserModel from "../model/User.model.js";
import { protect } from "../middleware/authMiddleware.js";
const connectionRouter = express.Router();

connectionRouter.use(protect);

connectionRouter.post("/:userId/request", async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.userId;

  if (senderId === receiverId) {
    return res.json({ message: "You cannot connect with yourself" });
  }

  const receiver = await UserModel.findOne({ _id: receiverId });

  if (!receiver) {
    return res.json({ message: "User not found" });
  }

  const existingRequest = await ConnectionModel.findOne({
    sender: senderId,
    receiver: receiverId
  });

  if (existingRequest) {
    return res.json({ message: "Request already sent" });
  }

  const request = await ConnectionModel.create({
    sender: senderId,
    receiver: receiverId,
    status: "pending"
  });

  res.json({
    message: "Connection request sent",
    request: request
  });
});



connectionRouter.get("/requests", async (req, res) => {
  const userId = req.user.id;

  const requests = await ConnectionModel.find({
    receiver: userId,
    status: "pending"
  });

  const senderIds = requests.map((item) => item.sender);

  const users = await UserModel.find({
    _id: { $in: senderIds }
  }).select("name email profilePicture");

  res.json({
    requests: requests,
    users: users
  });
});


connectionRouter.patch("/:requestId/accept", async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.user.id;

  const request = await ConnectionModel.findOne({
    _id: requestId,
    receiver: userId,
    status: "pending"
  });

  if (!request) {
    return res.json({ message: "Request not found" });
  }

  request.status = "accepted";

  await request.save();

  res.json({
    message: "Request accepted",
    request: request
  });
});


connectionRouter.patch("/:requestId/reject", async (req, res) => {
  const requestId = req.params.requestId;
  const userId = req.user.id;

  const request = await ConnectionModel.finndOne({
    _id: requestId,
    receiver: userId,
    status: "pending"
  });

  if (!request) {
    return res.json({ message: "Request not found" });
  }

  request.status = "rejected";

  await request.save();

  res.json({
    message: "Request rejected",
    request: request
  });
});



connectionRouter.get("/", async (req, res) => {
  const userId = req.user.id;

  const connections = await ConnectionModel.find({
    sender: userId,
    status: "accepted"
  });

  const connections2 = await ConnectionModel.find({
    receiver: userId,
    status: "accepted"
  });

  const users = await UserModel.find({
    _id: connections.map((item) => item.receiver)
  }).select("name email profilePicture");

  const users2 = await UserModel.find({
    _id: connections2.map((item) => item.sender)
  }).select("name email profilePicture");

  res.json({
    connections: [...users, ...users2],
    total: users.length + users2.length
  });
});



connectionRouter.delete("/:userId", async (req, res) => {
  const myId = req.user.id;
  const otherUserId = req.params.userId;

  const connection = await ConnectionModel.findOne({
    sender: myId,
    receiver: otherUserId,
    status: "accepted"
  });

  if (connection) {
    await ConnectionModel.deleteOne({ _id: connection._id });
    return res.json({ message: "Connection removed" });
  }

  const connection2 = await ConnectionModel.findOne({
    sender: otherUserId,
    receiver: myId,
    status: "accepted"
  });

  if (connection2) {
    await ConnectionModel.deleteOne({ _id: connection2._id });
    return res.json({ message: "Connection removed" });
  }

  res.json({ message: "Connection not found" });
});


export default connectionRouter