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
  await room.save();
  return room.populate({
    path: 'users',
    model: 'User',
    match: { _id: { $ne: senderId } },
  });
};

const findPrivateChatRoomByUserId = async (userId: string) => {
  const chatRooms = await privateChatRoom
    .find({ users: { $in: userId } })
    .populate({
      path: 'users',
      model: 'User',
      match: { _id: { $ne: userId } },
    });
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
    users: { $all: [senderId, receiverId] },
  });
  return chatRooms;
};

export {
  createChatRoom,
  findPrivateChatRoomByUserId,
  findExistedPrivateChatRoom,
};
