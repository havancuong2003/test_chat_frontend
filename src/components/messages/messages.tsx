import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import useListenMessages from "../../hooks/useListenMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./message";

// Định nghĩa kiểu dữ liệu cho message

const Messages = () => {
    const { messages, loading } = useGetMessages(); // `messages` should be of type MessageType[]
    useListenMessages();

    // Using useRef for the last message element
    const lastMessageRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Scroll to the last message when messages change
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [messages]);

    return (
        <div className="px-4 flex-1 overflow-auto">
            {!loading &&
                messages.length > 0 &&
                messages.map((message) => (
                    <div key={message._id} ref={lastMessageRef}>
                        <Message message={message} />
                    </div>
                ))}

            {loading &&
                [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

            {!loading && messages.length === 0 && (
                <p className="text-center">
                    Send a message to start the conversation
                </p>
            )}
        </div>
    );
};

export default Messages;
