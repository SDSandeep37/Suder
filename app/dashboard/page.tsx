import { useUser } from '@clerk/nextjs';

const Dashboard = () => {
  const {user} = useUser();
  return (
     <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.firstName}!
      </h1>
    </div>

  )
}

export default Dashboard