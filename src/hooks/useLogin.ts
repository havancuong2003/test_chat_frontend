import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

const useLogin = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const login = async (username: string, password: string): Promise<void> => {
        const success = handleInputErrors(username, password);
        if (!success) return;

        setLoading(true);
        console.log("username, password", username, password);

        try {
            const res = await fetch(
                "https://chatapp-6crt.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName: username, password }),
                }
            );

            const data = await res.json();
            console.log("check dataaaaaa", data);

            // Kiểm tra nếu có lỗi trong phản hồi
            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.setItem("chat-user", JSON.stringify(data));
            setAuthUser(data);
        } catch (error) {
            // Xử lý lỗi nếu có
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, login };
};

export default useLogin;

function handleInputErrors(username: string, password: string): boolean {
    if (!username || !password) {
        toast.error("Please fill in all fields");
        return false;
    }
    return true;
}
