"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { includes } from "zod";

const serializeTransactions = (obj) => {
  const serialized = { ...obj };

  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }

  return serialized;
};

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    //making rest of the accounts non-defualt
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    //setting the selected account as default
    await db.account.update({
      where: { id: accountId, userId: user.id },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");

    return { success: true, data: serializeTransactions(account) };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getAccountWithTransactions(accountId) {

    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    //getting the account
    const account = await db.account.findUnique({
      where: { id: accountId, userId: user.id },
      include: {
        transactions: {
          orderBy: { date: "desc" },
        },
        _count: {
            select: { transactions: true },
        },
      },
    });

    if (!account) return null;

    return {
      ...serializeTransactions(account),
      transactions: account.transactions.map(serializeTransactions),
    };
}

export async function bulkDeleteTransactions(transactionIds){
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    // calculating the amount of transactions to delete
    const accountBalanceChange = transactions.reduce((acc, transaction) => {
      const change = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    // Delete transactions and update the balance
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      for (const [accountId, change] of Object.entries(accountBalanceChange)) {
        await tx.account.update({
          where: { id: accountId },
          data: { balance: { increment: change } },
        });
      }
    });
    revalidatePath("/dashboard");
    revalidatePath("/account/[id]")

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

