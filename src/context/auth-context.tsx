import { createContext, useContext, useState, ReactNode } from "react";

// Định nghĩa kiểu dữ liệu cho User
interface User {
  _id: string;
  fullName: string;
  userName: string;
  profilePic: string;
  gender: string;
  // Thêm các thuộc tính khác nếu cần
}

// Định nghĩa kiểu dữ liệu cho `authUser` và `setAuthUser`
interface AuthContextType {
  authUser: User | null;
  setAuthUser: (user: User | null) => void;
}

// Khởi tạo context với kiểu dữ liệu của `AuthContextType`
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Custom hook để sử dụng `AuthContext`
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

// Định nghĩa kiểu dữ liệu cho `AuthContextProvider` props
interface AuthContextProviderProps {
  children: ReactNode;
}

// Component `AuthContextProvider` sử dụng kiểu dữ liệu đã định nghĩa
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [authUser, setAuthUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("chat-user") || "null")
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
