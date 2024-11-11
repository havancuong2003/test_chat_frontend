import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

const useSendMessage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { authUser } = useAuthContext();
  const userId = authUser?._id; // Giả sử bạn có userId từ context hoặc một nơi nào đó
  const sendMessage = async (message: string) => {
    if (!selectedConversation?._id) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/messages/send/${selectedConversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, userId }),
        }
      );

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Append the new message to the list of messages
      setMessages([...messages, data]);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
