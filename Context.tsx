"use client"
import { useUser } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";


type DBUser = {
  id?: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  mobile?: string;
  profile_pic: string;
};
type UserContextType = {
  userData: DBUser | null;
  setUserData: React.Dispatch<React.SetStateAction<DBUser | null>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {user} = useUser();
  const [userData, setUserData] = useState<DBUser | null>(null);
  useEffect(() => {
    const syncUserData = async () => {
      if (user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/sync`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerk_id: user.id,
              first_name: user.firstName || "",
              last_name: user.lastName || "",
              email: user.emailAddresses[0]?.emailAddress || "",
              phone: user.phoneNumbers[0]?.phoneNumber || "",
              profile_pic: user.imageUrl
            }),
          });
          if (response.ok) {
            const userData = await response.json();
            // Set user data in context coming from the backend
            setUserData(userData);
          } else {
            console.error("Failed to sync user data");
            setUserData({
              clerk_id: user.id,
              first_name: user.firstName || "",
              last_name: user.lastName || "",
              email: user.emailAddresses[0]?.emailAddress || "",
              mobile: user.phoneNumbers[0]?.phoneNumber || "",
              profile_pic: user.imageUrl
            });
          }
        } catch (error) {         
          console.error("Error syncing user data:", error);
          setUserData({
            clerk_id: user.id,
            first_name: user.firstName || "",
            last_name: user.lastName || "",
            email: user.emailAddresses[0]?.emailAddress || "",
            mobile: user.phoneNumbers[0]?.phoneNumber || "",
            profile_pic: user.imageUrl
            });
          }
      }
    };
    syncUserData();
  }, [user]);
  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};