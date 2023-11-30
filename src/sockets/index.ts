import { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TUser } from '../models/user';
import { findUserById } from '../services/user';
import { createMessage } from '../services/privateMessage';
const secret = 'your-secret-key';

export const initSocket = (app: Express) => {
  const http = createServer(app);
  const io = new Server(http);
  io.on('connection', async (socket) => {
    try {
      const token = socket.handshake.query.token as string;
      const { _id } = jwt.verify(token, secret) as TUser;
      const user = await findUserById(_id);
      user!.socketId = socket.id;
      await user?.save();
    } catch (e) {
      console.log(e);
    }

    socket.on(
      'sendMessage',
      async (
        {
          context,
          chatRoomId,
          receiverId,
        }: {
          context: string;
          chatRoomId: string;
          receiverId: string;
        },
        callback
      ) => {
        const token = socket.handshake.query.token as string;
        const { _id } = jwt.verify(token, secret) as TUser;
        const receiver = await findUserById(receiverId);
        console.log('context', context);
        const message = await createMessage({
          context,
          senderId: _id,
          receiverId,
          chatRoomId,
        });
        const receiverSocket = await io.sockets.sockets.get(receiver!.socketId);
        if (receiverSocket) receiverSocket?.emit('receiveMessge', message);
        callback({ status: 200, message });
      }
    );

    socket.on('disconnect', () => {
      console.log('User disconnected');
      // const user = deleteUser(socket.id);
      // if (user) {
      //     io.in(user.room).emit('notification', {
      //         title: 'Someone just left',
      //         description: `${user.name} just left the room`,
      //     });
      //     io.in(user.room).emit('users', getUsers(user.room));
      // }
    });
    io.on('error', (err: Error) => {
      console.error('Socket.IO connection error:', err.message);
      // Handle the error
    });
  });
  return http;
};
