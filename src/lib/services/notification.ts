import { prisma } from "@/lib/prisma";
import { notificationToModel } from "@/lib/mappers";
import { sendEmail } from "@/lib/email";
import type { NotificationModel } from "@/lib/models";

export async function getNotifications(
  accountId: string,
  after?: Date,
): Promise<NotificationModel[]> {
  const rows = await prisma.notification.findMany({
    where: {
      accountId,
      ...(after ? { timestamp: { gt: after } } : {}),
    },
    orderBy: { timestamp: "desc" },
  });
  return rows.map(notificationToModel);
}

function isEmailEnabled(): boolean {
  return process.env.NOTIFICATION_EMAIL === "true";
}

export async function sendNotification(input: {
  accountId: string;
  title: string;
  content: string;
  timestamp?: Date;
}): Promise<NotificationModel> {
  const row = await prisma.notification.create({
    data: {
      accountId: input.accountId,
      title: input.title,
      content: input.content,
      timestamp: input.timestamp ?? new Date(),
    },
  });

  if (isEmailEnabled()) {
    const account = await prisma.account.findUnique({
      where: { id: input.accountId },
      select: { email: true },
    });
    if (account?.email) {
      await sendEmail({
        to: account.email,
        subject: input.title,
        textBody: input.content,
      });
    }
  }

  return notificationToModel(row);
}
