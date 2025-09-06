"use client";
import React, { useEffect } from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/hooks/use-fetch";
import { updateDefaultAccount } from "@/actions/account";
import { toast } from "sonner";
import { DotLoader } from "react-spinners";

const AccountCard = ({ account }) => {

    const { name, type, balance, id, isDefault } = account;

    const { data: updateAccount, loading: updateDefaultLoading, error, fn:updateDefaultFn} = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (e) => {
        e.preventDefault();
        if(isDefault){
          toast.warning("You need atleast 1 default account");
          return;
        }
        await updateDefaultFn(id);
    }

    useEffect(()=>{
      if(updateAccount?.success){
        toast.success("Default account updated successfully");
      }
    },[updateDefaultLoading, updateAccount])

    useEffect(()=>{
        if(error){
            toast.error(error.message || "Failed to Toggle Default Account");;
        }
        
    },[error])

  return (
      <Card className="hover:shadow-md shadow-foreground hover:translate-y-1 transition-all duration-200 cursor-pointer group relative">
        <Link href={`/account/${id}`}>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{name}</CardTitle>
            <div className="flex gap-3">
                <p className="text-sm text-muted-foreground">
                    Default Account
                </p>
                {updateDefaultLoading ? <DotLoader size={15} color="#4B5563" />: (<Switch 
                checked={isDefault}
                onClick={handleDefaultChange}
                />)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex flex-col gap-3 mb-5">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex gap-3 justify-between text-sm text-muted-foreground">
          <div className="flex justify-center items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex justify-center items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
        </Link>
      </Card>

  );
};

export default AccountCard;
