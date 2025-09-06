"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { includes } from "zod";

const serializeTransactions = (obj) => {
    const serialized = {...obj};

    if(obj.balance){
        serialized.balance = obj.balance.toNumber();
    }
    if(obj.amount){
        serialized.amount = obj.amount.toNumber();
    }

    return serialized;
}

export async function createAccount(data){
    try{
        const { userId } = await auth();
        if(!userId) throw new Error("Unauthorized");

        // Create the account
        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });

        if(!user) throw new Error("User not found");

        //convert balance to float before saving
        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)){
            throw new Error("Invalid balance amount");
        }

        const existingAccount = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccount.length === 0? true: data.isDefault;

        //making rest of the accounts as non-default
        if(shouldBeDefault){
            await db.account.updateMany({
                where:{userId: user.id, isDefault: true},
                data:{isDefault: false},
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                userId: user.id,
                isDefault: shouldBeDefault,
                balance: balanceFloat
            }
        });
        
        const serializedAccount = serializeTransactions(account);

        revalidatePath('/dashboard');
        return {success: true, data: serializedAccount};
    }catch(err){
        console.error(err);
        throw new Error("Failed to create account");
    }
}

export async function getUserAccounts() {
    try{
        const { userId } = await auth();
        if(!userId) throw new Error("Unauthorized");

        // Create the account
        const user = await db.user.findUnique({
            where: { clerkUserId: userId }
        });

        if(!user) throw new Error("User not found");

        const userAccounts = await db.account.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { transactions: true }
                }
            }
        });

        const serializedAccount = userAccounts.map(serializeTransactions);
        return serializedAccount;

        // return { success: true, data: userAccounts };
    }catch(err){
        console.error(err);
        throw new Error("Failed to retrieve user accounts");
    }
}