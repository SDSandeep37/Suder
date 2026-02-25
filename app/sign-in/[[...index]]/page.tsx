import { SignIn } from "@clerk/nextjs"

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn fallbackRedirectUrl="/dashboard"/>
    </div>
  );

}

export default Page