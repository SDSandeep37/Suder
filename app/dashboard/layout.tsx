import Navbar from "@/components/Navbar/Navbar";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <SignedIn>
      <Navbar />
      {children}  
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn redirectUrl="/" />

    </SignedOut>
    
      
    </>
  );
}