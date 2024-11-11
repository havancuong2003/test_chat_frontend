import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

// Định nghĩa kiểu dữ liệu cho message
interface MessageType {
  _id: string;
  senderId: string;
  createdAt: string;
  message: string;
  shouldShake?: boolean;
}

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const userId = authUser?._id; // Giả sử bạn có userId từ context hoặc một nơi nào đó

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        // Kiểm tra xem selectedConversation có tồn tại không
        if (!selectedConversation?._id) {
          toast.error("No conversation selected.");
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/messages/${selectedConversation._id}`,
          {
            method: "POST", // Sử dụng POST
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }), // Truyền userId trong body
          }
        );

        // Kiểm tra mã trạng thái HTTP
        if (!res.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data: MessageType[] = await res.json(); // Đảm bảo rằng data trả về là MessageType[]

        // Kiểm tra nếu dữ liệu trả về rỗng hoặc không hợp lệ
        if (!Array.isArray(data)) {
          throw new Error("Invalid message data received");
        }

        setMessages(data); // Cập nhật trạng thái với dữ liệu MessageType[]
      } catch (error: unknown) {
        // Type check for the error to access its message
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi getMessages khi selectedConversation tồn tại
    if (selectedConversation?._id) {
      getMessages();
    }
  }, [selectedConversation?._id, setMessages, userId]);

  return { messages, loading };
};

export default useGetMessages;
