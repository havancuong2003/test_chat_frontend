import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { useAuthContext } from "./auth-context";
import io, { Socket } from "socket.io-client";

// Định nghĩa kiểu dữ liệu cho SocketContext
interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[]; // Hoặc có thể sử dụng kiểu người dùng khác nếu bạn có thông tin chi tiết về người dùng
}

// Tạo context với kiểu dữ liệu đã định nghĩa
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Custom hook để sử dụng SocketContext
export const useSocketContext = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

// Định nghĩa kiểu dữ liệu cho SocketContextProvider props
interface SocketContextProviderProps {
  children: ReactNode;
}

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      // socket.on() is used to listen to the events
      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      // Cleanup function to close the socket connection
      return () => {
        socket.close(); // Properly close the socket on cleanup
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
