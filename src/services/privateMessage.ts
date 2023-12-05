import mongoose, { Schema } from 'mongoose';
import privateChatRoom from '../models/privateChatRoom';
import privateMessage, { PrivateMessage } from '../models/privateMessage';

const createMessage = async ({
  context,
  senderId,
  receiverId,
  chatRoomId,
}: {
  context: string;
  senderId: string;
  receiverId: string;
  chatRoomId: string;
}) => {
  const message = new privateMessage({
    context,
    senderId,
    receiverId,
    chatRoomId,
  });
  return await message.save();
};

const findMessagesByRoomId = async (roomIds: Array<string>):Promise<PrivateMessage[]> => {
  const messages = await privateMessage.aggregate([
    {
      $match: {
        chatRoomId: { $in: roomIds },
      },
    },
    {
      $sort: { createdAt: -1 }, // Sort messages by timestamp in descending order
    },
    {
      $group: {
        _id: '$chatRoomId',
        last10Messages: { $push: '$$ROOT' }, // Push each message to the array
      },
    },
    {
      $project: {
        _id: 1, // Include the chatroomId in the result
        last10Messages: { $slice: ['$last10Messages', 10] }, // Get the last 10 messages
      },
    },
    { $unwind: '$last10Messages' },
  ]);
  return messages.map(msg=>msg.last10Messages).reverse();
  // const messages = await privateMessage.find({ chatRoomId: { $in: roomIds } });
  // return messages;
};

export { createMessage, findMessagesByRoomId };
