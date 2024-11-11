import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

interface SignupData {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    gender: string;
}

const useSignup = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const signup = async ({
        fullName,
        username,
        password,
        confirmPassword,
        gender,
    }: SignupData): Promise<void> => {
        const success = handleInputErrors({
            fullName,
            username,
            password,
            confirmPassword,
            gender,
        });
        if (!success) return;

        setLoading(true);
        try {
            const res = await fetch(
                "https://chatapp-6crt.onrender.com/api/auth/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName,
                        username,
                        password,
                        confirmPassword,
                        gender,
                    }),
                }
            );

            const data = await res.json();

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

    return { loading, signup };
};

export default useSignup;

function handleInputErrors({
    fullName,
    username,
    password,
    confirmPassword,
    gender,
}: SignupData): boolean {
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error("Please fill in all fields");
        return false;
    }

    if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return false;
    }

    if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return false;
    }

    return true;
}
