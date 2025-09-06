import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { ModeToggle } from "./ui/ModeToggle";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  await checkUser();
  return (
    <header className="fixed top-0 shadow-md w-full z-999 b-white/80 backdrop-blur-md border-b">
      <nav className="container mx-auto py-3 px-4 flex justify-between items-center font-semibold text-lg sm:text-xl">
        <Link href={"/"}>
          <span className="bg-gradient-to-b from-purple-300/80 to-blue-600 text-transparent bg-clip-text font-serif text-2xl">Finora</span>
        </Link>

        <div className="flex justify-between gap-4">

          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant={"outline"} className="flex gap-3 items-center"><LayoutDashboard size={22}/><span className="hidden md:inline">Dashboard</span></Button>
            </Link>

            <Link href={"/transaction/create"}>
              <Button className="flex gap-3 items-center"><PenBox size={22}/><span className="hidden md:inline">Add Transaction</span></Button>
            </Link>

            <ModeToggle />

          </SignedIn>

          <SignedOut>
            <div className="flex gap-4 items-center">
              <SignInButton forceRedirectUrl="/dashboard">
                <Button
                  variant={"outline"}
                  size={"lg"}
                  className="cursor-pointer"
                >
                  Login
                </Button>
              </SignInButton>
              {/* <SignUpButton>
            <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton> */}
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{
              elements: {
                avatarBox: "w-20 h-20",
              }
            }}/>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
