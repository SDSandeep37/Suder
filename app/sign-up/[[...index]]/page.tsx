import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/dashboard"/>
    </div>
  )
}

export default Page