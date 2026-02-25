import { useUser } from "@clerk/nextjs";
import "./profile.css";
import { useEffect, useState, type SubmitEvent } from "react";
const Profile = () => {
  const {user} = useUser();
  const [firstName, setFirstName]= useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const handleSubmit =  async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {      
      const response = await fetch("http://localhost:3001/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          email
        }),
      });
      if (response.ok) {
        const result = await response.json();
        setMessage("Profile updated successfully!");
        setMessageType("success");
        console.log("Profile updated:", result);
      }
        else {
          setMessage("Failed to update profile. Please try again.");
          setMessageType("error");
        }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
      console.error("Error updating profile:", error);
    }finally {      
      setLoading(false);
    }
  };
  useEffect(() => {
  if (message) {
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }
}, [message]);
// Load Clerk user details into state when available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      setPhone(user.phoneNumbers[0]?.phoneNumber || "");
    }
  }, [user]);

  return (
    <>
    <div className="profileContainer flex flex-col items-center justify-center min-h-full">
        <h1 className="profileName font-bold text-4xl p-4">Hello,{user?.firstName || "Name"} {user?.lastName || "Title"}</h1>
      <div className="profileDetails flex flex-col w-[60%] justify-center items-center">
        <div className="profileLeft">
          <img className="profileImage rounded-full w-48 h-48 mx-auto" src={user?.imageUrl} alt={`${firstName}'s profile picture`} />
        </div>
        <div className="profileRight w-full rounded-2xl p-6 border border-gray-300 shadow-lg">
          <div className="profileForm">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="formContent">
                <label className="block mb-2 font-bold text-lg" htmlFor="first_name">First Name</label>
                <input className="w-full p-2 mb-4 border border-gray-300 rounded" type="text" id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
              </div>
              <div className="formContent">
                <label className="block mb-2 font-bold text-lg" htmlFor="last_name">Last Name</label>
                <input className="w-full p-2 mb-4 border border-gray-300 rounded" type="text" id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
              </div>
              <div className="formContent">
                <label className="block mb-2 font-bold text-lg" htmlFor="email" >Email</label>
                <input className="w-full p-2 mb-4 border border-gray-300 rounded" type="email" id="email" value={email} readOnly  placeholder="Enter email"/>
              </div>
              <div className="formContent">
              <label className="block mb-2 font-bold text-lg" htmlFor="phone">Phone Number</label>
              <input className="w-full p-2 mb-4 border border-gray-300 rounded" type="text" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your mobile number" />
              </div>
              {/* Message while processing */}
              {loading && (
                <p className="mt-2 mb-2 text-sm text-shadow-amber-100">Please wait while updating your profile...</p>
              )}
              {/* Message Display */}
                {message && !loading && (
                  <p
                    className={`mt-2 mb-2 text-sm ${
                      messageType === "success" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {message}
                  </p>
                )}

              <div className="formContent buttonContainer ">
                <button className=" px-4 py-2 rounded " type="submit">Update Profile</button>
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
    </>
  )
}

export default Profile