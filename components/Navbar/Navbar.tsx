"use client"
import "./navbar.css"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
const Navbar = () => {
  return (
    <nav className="navbar flex items-center justify-between">
      <div className="navbarLeft">
        <h1 className="logo">
          Super Delux Ride
        </h1>
      </div>
        <div className="navbarRight ">
          <Link href="/dashboard/profile" className="navbarLink">
            Profile
          </Link>
          {/* <UserButton afterSwitchSessionUrl="/" /> */}
        </div>
    </nav>
  )
}

export default Navbar