import { useAuthContext } from "../../context/auth-context";
import { extractTime } from "../../utils/extract-time";
import useConversation from "../../zustand/useConversation";

// Định nghĩa kiểu dữ liệu cho message
interface MessageType {
  senderId: string;
  createdAt: string;
  message: string;
  shouldShake?: boolean;
}

interface MessageProps {
  message: MessageType;
}

const Message = ({ message }: MessageProps) => {
  const { authUser } = useAuthContext(); // Xác định kiểu của authUser mà không cần truyền kiểu
  const { selectedConversation } = useConversation(); // Xác định kiểu của selectedConversation mà không cần truyền kiểu

  if (!authUser) {
    // Handle trường hợp authUser là null nếu cần thiết
    return null;
  }

  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic || "default-profile-pic.jpg"; // fallback nếu không có profilePic
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const shakeClass = message.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS chat bubble component" src={profilePic} />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
