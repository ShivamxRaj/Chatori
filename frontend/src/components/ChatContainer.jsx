import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { CheckIcon, CheckCheckIcon } from "lucide-react";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-5 overflow-y-auto py-6 space-y-1">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, idx) => {
              const isMe = msg.senderId === authUser._id || msg.senderId?._id === authUser._id;
              const isOptimistic = msg.isOptimistic;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"} msg-slide-in`}
                  style={{ animationDelay: `${Math.min(idx * 0.03, 0.3)}s` }}
                >
                  {/* Other person avatar */}
                  {!isMe && (
                    <img
                      src={selectedUser.profilePic || "/avatar.png"}
                      alt=""
                      className="size-8 rounded-full object-cover mr-2 self-end ring-1 ring-violet-500/20 flex-shrink-0"
                    />
                  )}

                  <div className={`max-w-[70%] group`}>
                    {/* Image */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Shared"
                        className={`rounded-2xl mb-1 h-48 object-cover shadow-lg ${isMe ? "ml-auto" : ""}`}
                      />
                    )}

                    {/* Text bubble */}
                    {msg.text && (
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                          isMe
                            ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-sm"
                            : "bg-white/8 border border-violet-500/10 text-slate-200 rounded-bl-sm backdrop-blur-sm"
                        } ${isOptimistic ? "opacity-80" : ""}`}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Timestamp + delivery status */}
                    <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {isMe && (
                        isOptimistic
                          ? <CheckIcon className="size-3 text-slate-500" />
                          : <CheckCheckIcon className={`size-3 ${msg.read ? "text-fuchsia-400" : "text-violet-400"}`} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
