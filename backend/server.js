const dotenv = require("dotenv");
const app = require("./app");
dotenv.config({ path: ".env" });
const express = require("express");
const connectDB = require("./configs/db");
const socket = require("socket.io");
const { json } = require("body-parser");
const Message = require("./Model/messageModel");
const Users = require("./Model/userModel");
const cors = require("cors");
const bodyParser = require("body-parser");
connectDB();
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: ".env" });
}
const rooms = ["general", "tech", "finance", "crypto"];
app.get("/rooms", (req, res) => {
  res.json(rooms);
});
app.get("/", (req, res) => {
  return res.status(200).json({
    status: "200",
    message: "WellCome To Tai Heo.",
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`server is listening on port:http://localhost:${PORT}`)
);
const io = socket(server, {
  cors: {
    origin: process.env.FRONT_END,
    credentials: true,
  },
});
async function getLastMessageFromRoom(room) {
  let roomMessage = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessage;
}
//Sắp xếp lại ngày
// 02/11/2022
// 20220211
function SortRoomMessageByDate(message) {
  return message.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];
    return date1 < date2 ? -1 : 1;
  });
}

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
  socket.on("new-user", async () => {
    const member = await Users.find();
    io.emit("new-user", member);
  });
  socket.on("join-room", async (room, previousRoom) => {
    socket.join(room);
    socket.leave(previousRoom);
    let roomMessages = await getLastMessageFromRoom(room);
    roomMessages = SortRoomMessageByDate(roomMessages);
    socket.emit("room-messages", roomMessages);
  });
  socket.on("message-room", async (room, content, sender, time, date) => {
    console.log(room, "new content", content);
    const newMessage = await Message.create({
      content,
      from: sender,
      time,
      date,
      to: room,
    });

    let roomMessages = await getLastMessageFromRoom(room);
    roomMessages = SortRoomMessageByDate(roomMessages);
    //send message
    io.to(room).emit("room-messages", roomMessages);
    socket.broadcast.emit("notifications", room);
  });
  // app.delete("/logout/:id", async (req, res, next) => {
  app.post("/logout", async (req, res) => {
    try {
      const { user } = req.body;
      const users = await Users.findById(user._id);
      users.status = "offline";
      users.newMessage = user.newMessage;
      await users.save();
      const members = await Users.find();
      socket.broadcast.emit("new-user", members);
      return res.json({ status: true, msg: "Logout Success" });
    } catch (ex) {
      res.status(400).send();
    }
  });
});
