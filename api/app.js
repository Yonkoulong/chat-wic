const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const http = require("http");
const ChannelModel = require("./models/channel.model");
const DirectModel = require("./models/direct.model");
const User = require("./models/user.model");
const { IUserStatus, ObjectIdMongodb } = require("./utils/constant");

const {
  isObjectIdInMongodb,
  isArray,
} = require("./utils/validation");

mongoose.set("strictQuery", true);

const app = express();
const server = http.createServer(app);
const setupMiddleware = require("./app-middleware");
const setupRoutes = require("./app-routes");

const setupApp = async () => {
  setupMiddleware(app);
  setupRoutes(app);

  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("DB-Connect-done");
    })
    .catch((err) => {
      console.log(err);
    });

  const expressServer = server.listen(process.env.PORT || 8080, () => {
    console.log(`listen on port ${process.env.PORT || 8080}`);
  });

  const io = new Server(expressServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", async (socket) => {
    console.log(
      "We have a new connection!!!!",
      socket.handshake.headers?.userid
    );
    const userId = socket.handshake.headers?.userid;
    socket.data.userId = socket.handshake.headers?.userid;


    //update status when connection
    if (isObjectIdInMongodb(userId)) {
      const convertId = ObjectIdMongodb(userId);

      try {
        const userInfo = await User.find({ _id: convertId })

        if (userInfo?.length > 0 && userInfo[0].userStatus === IUserStatus?.offline) {  
          const newUserInfo = { ...userInfo[0]?._doc, userStatus: IUserStatus?.online }

          await User.updateOne(
            { _id: convertId }, {
            $set: newUserInfo,
            $currentDate: { lastUpdated: true },
          }
          )
        }
      } catch (error) {
        throw error;
      }
    }

    const connecteds = io.sockets.sockets;

    //list channel
    try {
      const channelsByUserId = await ChannelModel.find({
        userIds: { $in: [socket.handshake.headers?.userid] },
      });

      if (channelsByUserId) {
        channelsByUserId.forEach((channel) => {
          socket.join([channel?._id]);
        });
      }
    } catch (error) {
      throw error;
    }

    //list direct
    try {
      const directsByUserId = await DirectModel.find({
        userIds: { $in: [socket.handshake.headers?.userid] },
      });

      if (directsByUserId) {
        directsByUserId.forEach((direct) => {
          socket.join([direct?._id]);
        })
      }
    } catch (error) {
      throw error;
    }

    //status member
    // socket.on('update-status-user', (data) => {
    //   console.log(data);
    //   if(data) {
    //     io.emit('status-user-updated', data);
    //   }
    // })

    socket.on("room", (data) => {
      //data is idRoom
      socket.join(data);
      console.log("You are connecting to this room", data);
    });

    //channel
    socket.on("create-channel-room", async (data) => {
      socket.join(data?._id);
      const sockets = await io.fetchSockets();
      // const membersSocketId = sockets
      //   .filter((item) => {
      //     return data.userIds.includes(item.data.userId);
      //   })
      //   .map((x) => x.id);
     
      // console.log("list memeber id socket: ", membersSocketId);
      io.emit("invited-to-a-channel", { 
        usersId: data.userIds,
        channelId: data?._id
      });
    });

    socket.on("send-message-channel", (data) => {
      socket.to(data?.channelId).emit("receive-message-channel", data);
    });

    socket.on('delete-message-channel', (data) => {
      socket.to(data?.channelId).emit('receive-message-channel-delete', data?.messageId);
    })

    socket.on('edit-message-channel', (data) => {
      socket.to(data?.channelId).emit('receive-message-channel-edit', data);
    })

    socket.on('reaction-message-channel', (data) => {
      socket.to(data?.channelId).emit('receive-message-channel-reaction', data);
    })

    //thread in channel
    socket.on("join-message-thread", (data) => {
      socket.join(data);
      console.log(data + "we have a new connect to this thread")
    })

    socket.on("send-message-thread", (data) => {
      socket.to(data?.threadId).emit("receive-message-thread", data);
    });

    socket.on('delete-message-thread', (data) => {
      socket.to(data?.threađId).emit('receive-message-thread-delete', data?.messageId);
    })

    socket.on('edit-message-thread', (data) => {
      socket.to(data?.threadId).emit('receive-message-thread-edit', data);
    })

    socket.on('reaction-message-thread', (data) => {
      socket.to(data?.threadId).emit('receive-message-thread-reaction', data);
    })


    //direct
    socket.on("create-direct-room", async (data) => {
      socket.join(data?._id);
      const sockets = await io.fetchSockets();
      const membersSocketId = sockets
        .filter((item) => {
          return data.userIds.includes(item.data.userId);
        })
        .map((x) => x.id);
      io.to(membersSocketId).emit("invited-to-a-direct", { data: data?._id });
    });

    socket.on("send-message-direct", (data) => {
      socket.to(data?.directId).emit("receive-message-direct", data);
    });

    socket.on('delete-message-direct', (data) => {
      socket.to(data?.directId).emit('receive-message-direct-delete', data?.messageId);
    })

    socket.on('edit-message-direct', (data) => {
      socket.to(data?.directId).emit('receive-message-direct-edit', data);
    })

    socket.on('reaction-message-direct', (data) => {
      socket.to(data?.directId).emit('receive-message-direct-reaction', data);
    })

    //behavior
    socket.on("typing", (data) => {
      socket.to(data.room).emit("typing");
    });

    socket.on("disconnect", async () => {
      console.log("user is offline", socket.handshake.headers?.userid);

      if (isObjectIdInMongodb(userId)) {
        const convertId = ObjectIdMongodb(userId);

        try {
          const userInfo = await User.find({ _id: convertId })
          
          if (userInfo?.length > 0 && userInfo[0].userStatus == IUserStatus?.online) {  
            const newUserInfo = { ...userInfo[0]?._doc, userStatus: IUserStatus?.offline }
  
            await User.updateOne(
              { _id: convertId }, {
              $set: newUserInfo,
              $currentDate: { lastUpdated: true },
            }
            )
          }
        } catch (error) {
          throw error;
        }
      }
    });
  });
};

setupApp();
