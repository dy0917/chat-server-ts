import privateChatRoom from '../models/privateChatRoom';

const createChatRoom = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  const room = new privateChatRoom({
    users: [senderId, receiverId],
  });
  return await room.save();
};

const findPrivateChatRoomByUserId = async (userId: string) => {
    const chatRooms = await privateChatRoom.find({ users: { $in: userId } }).populate({
        path: 'users',
        model: 'User',
        match: { _id: { $ne: userId } },
    }
  );
  return chatRooms;
};

const findExistedPrivateChatRoom = async ({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) => {
  const chatRooms = await privateChatRoom.find({
    users: { $in: [senderId, receiverId] },
  });
  return chatRooms;
};

export {
  createChatRoom,
  findPrivateChatRoomByUserId,
  findExistedPrivateChatRoom,
};
