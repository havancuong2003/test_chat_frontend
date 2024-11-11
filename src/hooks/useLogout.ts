import { useState } from "react";

import toast from "react-hot-toast";
import { useAuthContext } from "../context/auth-context";

const useLogout = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { setAuthUser } = useAuthContext();

    const logout = async (): Promise<void> => {
        setLoading(true);

        try {
            const res = await fetch(
                "https://chatapp-6crt.onrender.com/api/auth/logout",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data: { error?: string } = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            localStorage.removeItem("chat-user");
            setAuthUser(null);
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, logout };
};

export default useLogout;
