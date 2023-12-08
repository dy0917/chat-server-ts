import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TUser } from '../models/user';
import { findUserById } from '../services/user';
import { createMessage } from '../services/privateMessage';
import { encryptionKey } from '../env';
import { PrivateChatRoom } from '../models/privateChatRoom';
class AppSocket {
  private _io;
  constructor(http: any) {
    this._io = new Server(http);
    this._onConnection();
  }
  _onConnection() {
    this._io.on('connection', async (socket) => {
      try {
        const token = socket.handshake.query.token as string;
        const { _id } = jwt.verify(token, encryptionKey!) as TUser;
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
          try {
            const token = socket.handshake.query.token as string;
            const { _id } = jwt.verify(token, encryptionKey!) as TUser;
            const receiver = await findUserById(receiverId);
            const message = await createMessage({
              context,
              senderId: _id,
              receiverId,
              chatRoomId,
            });
            const receiverSocket = await this._io.sockets.sockets.get(
              receiver!.socketId
            );
            if (receiverSocket) receiverSocket?.emit('receiveMessge', message);
            callback({ status: 200, message });
          } catch (e) {
            callback({ status: 400 });
          }
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
      this._io.on('error', (err: Error) => {
        console.error('Socket.IO connection error:', err.message);
        // Handle the error
      });
    });
  }
  async sendRoomConfirm(socketId: string, room: PrivateChatRoom) {
    const receiverSocket = await this._io.sockets.sockets.get(socketId);
    receiverSocket?.emit('addRoom', room);
  }
}

export const newSocket = (http:any) => new AppSocket(http);

