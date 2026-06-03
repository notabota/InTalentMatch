import { prisma } from "@/lib/prisma";
import { messageToModel } from "@/lib/mappers";
import type { MessageModel } from "@/lib/models";

export async function getMessages(
  accountId: string,
  peerId: string,
  after?: Date,
): Promise<MessageModel[]> {
  const rows = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: accountId, receiverId: peerId },
        { senderId: peerId, receiverId: accountId },
      ],
      ...(after ? { timestamp: { gt: after } } : {}),
    },
    orderBy: { timestamp: "desc" },
  });
  return rows.map(messageToModel);
}

export async function sendMessage(input: {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
}): Promise<MessageModel> {
  const row = await prisma.message.create({
    data: {
      senderId: input.senderId,
      receiverId: input.receiverId,
      content: input.content,
      timestamp: input.timestamp ?? new Date(),
    },
  });
  return messageToModel(row);
}
