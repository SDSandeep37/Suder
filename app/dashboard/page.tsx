"use client"
import { useUserContext } from '@/Context';

const Dashboard = () => {
  const { userData } = useUserContext();
  const firstName = userData?.first_name || "Guest";
  return (
      <main className="p-6">
          <h1 className="text-2xl font-bold">
            Welcome, <span>{firstName}</span>!
          </h1>
        </main>


  )
}

export default Dashboard