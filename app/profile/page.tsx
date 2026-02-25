"use client"
import Navbar from '@/components/Navbar/Navbar'
import Profile from '@/components/Profile/Profile'

const Page = () => {
  return (
    <>
    <Navbar />
    <div className="h-screen">
      <Profile />
    </div>
    </>
  )
}

export default Page