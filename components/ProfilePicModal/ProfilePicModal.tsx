"use client"

import "./modal.css";
import { ChangeEvent, SubmitEvent, useState } from "react";
import { useUserContext } from "@/Context";
interface ProfilePicModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string |number;
  onUploadSuccess: (newImageUrl: string) => void;
}

const ProfilePicModal = ({isOpen, onClose, userId, onUploadSuccess}: ProfilePicModalProps) => { 
  
  const [file,setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  userId = useUserContext().userData?.id || ""; // Ensure userId is set from context
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a valid image file.");
    }
  };
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("No file selected. Please choose an image to upload.");
      return;
    }
    setLoading(true);
    try {
      
      const formData = new FormData();
      formData.append("profile_pic", file);
      formData.append("id", userId.toString());
      console.log("Testing form data with user id:", formData);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}users/profile_pic`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onUploadSuccess(result.profile_pic_url);
        onClose();
      } else {
        setError("Failed to upload image. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while uploading. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="modalOverlay">
      <div className="modalContent flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Upload New Profile Picture</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input  className="border border-gray-300 rounded p-2 w-full" type="file" accept="image/*" onChange={handleFileChange} name="file" />
          {error && <p className="text-red-600">{error}</p>}
          <div className="modalButtons flex gap-4">
          <button type="submit" disabled={loading} className={`px-4 py-2 rounded ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}`}>
            {loading ? "Uploading..." : "Upload"}
          </button>
          <button type="button" onClick={onClose}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Cancel</button>
          </div>
            
        </form>
      </div>
    </div>

  )
}

export default ProfilePicModal