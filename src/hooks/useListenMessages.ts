import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";
import { useSocketContext } from "../context/socket-context";

const useListenMessages = () => {
    const { socket } = useSocketContext();
    const { messages, setMessages } = useConversation();

    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage: any) => {
                newMessage.shouldShake = true;
                const sound = new Audio(notificationSound);
                sound.play();
                setMessages([...messages, newMessage]);
            };

            // Listen for the "newMessage" event
            socket.on("newMessage", handleNewMessage);

            // Cleanup function to remove the event listener
            return () => {
                socket.off("newMessage", handleNewMessage);
            };
        }
    }, [socket, setMessages, messages]); // Re-run when socket or messages change
};

export default useListenMessages;
