import { getAccountWithTransactions } from "@/actions/account";
import { color } from "motion";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { BarLoader } from "react-spinners";
import TransactionTable from "../_components/transaction_table";
import AccountsChart from "../_components/accounts_chart";

const AccountPage = async ({ params }) => {
  const paramss = await params;
  const account = await getAccountWithTransactions(paramss.id);

  if (!account) {
    notFound();
  }

  const { transactions, ...accountDetails } = account;

  return (
    <div className="space-y-8 px-5 ">
      <div className="flex gap-4 items-end justify-between">
      <div className="">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight capitalize bg-gradient-to-b from-purple-500 via-violet-500 to-pink-500 text-transparent bg-clip-text">{accountDetails.name}</h1>
        <p className="text-muted-foreground">
          {accountDetails.type.charAt(0) + accountDetails.type.slice(1).toLowerCase()} Account
        </p>
      </div>

      <div className="text-right pb-2">
        <div className="text-xl sm:text-2xl font-bold">₹{parseFloat(accountDetails.balance).toFixed(2)}</div>
        <p className="text-sm text-muted-foreground">{accountDetails._count.transactions} Transactions</p>
      </div>

      </div>

      {/* Chart Section  */}
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <AccountsChart transactions={transactions} />
      </Suspense>
      {/* Transactions table  */}

      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
        <TransactionTable transactions={transactions} />
      </Suspense>

    </div>
  );
};

export default AccountPage;
