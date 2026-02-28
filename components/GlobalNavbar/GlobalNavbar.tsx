"use client";
import "./globalNavbar.css";
import { useUserContext } from "@/Context";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";


const GlobalNavbar = () => {
  return (
    <nav className=" globalNavbar flex justify-between items-center">
    
      <Link href="/" className="flex items-center gap-2">
       <img
        className="Logo"
        src="/logo.png"
        alt="Suder Logo"
      />
      </Link>
      
    <div className="flex gap-4">
      <SignedIn>
        {/* <span className="welcome">Welcome, {useUserContext().userData?.first_name}!</span> */}
        <Link href="/dashboard">
          <button className="btn dashboard">Dashboard</button>
        </Link>
        <UserButton afterSwitchSessionUrl="/" />
        <span className="mr-2"></span>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn login">Login</button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="btn signUp">Sign Up</button>
        </SignUpButton>
      </SignedOut>
    </div>
  </nav>

  )
}
export default GlobalNavbar
