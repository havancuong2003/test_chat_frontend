import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

// Define types for the conversation
interface Conversation {
  _id: string;
  profilePic?: string;
  fullName: string;
  // Add other fields here as per your conversation data structure
}

const useGetConversations = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          method: "POST", // Đổi từ GET sang POST
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Đảm bảo gửi cookie (token) từ frontend
          body: JSON.stringify({ userId: authUser?._id }), // Truyền userId trong body
        });

        if (!res.ok) {
          throw new Error("Failed to fetch conversations.");
        }

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setConversations(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (authUser?._id) {
      getConversations();
    }
  }, [authUser?._id]); // Chạy lại khi userId thay đổi

  return { loading, conversations };
};

export default useGetConversations;
