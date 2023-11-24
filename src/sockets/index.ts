import { Express } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TUser } from '../models/user';
import { findUserById } from '../services/user';
const secret = 'your-secret-key';

const { addUser, getUser, deleteUser, getUsers } = require('../users');

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
            const sockets = await io.fetchSockets();
            console.log(
                'clients',
                sockets.map((s) => s.id)
            );
        } catch (e) { 
            console.log(e);
        }
    // socket.on('login', ({ name, room }, callback) => {
    //     const { user, error } = addUser(socket.id, name, room);
    //     if (error) return callback(error);
    //     socket.join(user.room);
    //     socket.in(room).emit('notification', {
    //         title: "Someone's here",
    //         description: `${user.name} just entered the room`,
    //     });
    //     io.in(room).emit('users', getUsers(room));
    //     callback();
    // });

    socket.on('sendPrivateMessage', (message) => {
      const user = getUser(socket.id);
      io.in(user.room).emit('personalMessage', {
        user: user.name,
        text: message,
      });
    });
    // socket.on('sendMessage', (message) => {
    //     const user = getUser(socket.id);
    //     io.in(user.room).emit('message', { user: user.name, text: message });
    // });

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
