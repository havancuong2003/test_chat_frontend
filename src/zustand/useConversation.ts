import { create } from "zustand";

// Định nghĩa kiểu cho dữ liệu state của useConversation
interface Conversation {
  _id: string;
  profilePic?: string;
  fullName: string;
  // Các thuộc tính khác của cuộc trò chuyện nếu cần
}

interface MessageType {
  _id: string;
  senderId: string;
  createdAt: string;
  message: string;
  shouldShake?: boolean;
}

interface ConversationState {
  selectedConversation: Conversation | null; // Thay đổi để lưu đối tượng cuộc trò chuyện
  setSelectedConversation: (selectedConversation: Conversation | null) => void;
  messages: MessageType[]; // Cập nhật từ string[] thành MessageType[]
  setMessages: (messages: MessageType[]) => void; // Cập nhật kiểu đối số
}

// Tạo store Zustand với các kiểu dữ liệu đã định nghĩa
const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),
  messages: [], // Cập nhật kiểu ban đầu là mảng MessageType[]
  setMessages: (messages) => set({ messages }),
}));

export default useConversation;
