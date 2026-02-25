"use client"
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from '@clerk/nextjs';

const Dashboard = () => {
  const {user} = useUser();
  return (
     <>
      <SignedIn>
        <div className="p-6">
          <h1 className="text-2xl font-bold">
            Welcome, <span>{useUser().user?.firstName}</span>!
          </h1>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>


  )
}

export default Dashboard