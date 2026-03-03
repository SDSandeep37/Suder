"use client"
import BookRide from '@/components/BookRide/BookRide';
import { useUserContext } from '@/Context';

const Dashboard = () => {
  const { userData } = useUserContext();
  const firstName = userData?.first_name || "Guest";
  
  return (
    <main className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Welcome, <span>{firstName}</span>!
        </h1>
        <BookRide/>
      </main>


  )
}

export default Dashboard