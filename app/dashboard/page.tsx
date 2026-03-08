"use client"
import BookRide from '@/components/BookRide/BookRide';
import { useUserContext } from '@/Context';
import DriverDashoard from '@/components/DriverDashboard/DriverDashoard';


const Dashboard = () => {
  const { userData } = useUserContext();
  const firstName = userData?.first_name || "Guest";
  const isDriver = userData?.isDriver;
  
  if(!userData){
    return (
      <p className='p-6'>Checking user role....</p>
    )
  }
  return (
    <main className="p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Welcome, <span>{firstName}</span>!
        </h1>
        {isDriver ? <DriverDashoard/> :<BookRide/>}
        
      </main>


  )
}

export default Dashboard