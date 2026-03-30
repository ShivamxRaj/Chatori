import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center px-5 py-3 border-b border-violet-500/10 bg-white/[0.02] backdrop-blur-sm min-h-[70px]">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className={`size-11 rounded-full object-cover ring-2 transition-all ${
              isOnline ? "ring-violet-500/60 glow-violet-sm" : "ring-slate-600/40"
            }`}
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 ring-2 ring-[#0d0d1a] animate-[pulse-dot_2s_ease-in-out_infinite]" />
          )}
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm">{selectedUser.fullName}</h3>
          <p className={`text-xs font-medium ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
            {isOnline ? "● Online" : "○ Offline"}
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-violet-500/20 transition-all"
        title="Close (Esc)"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
export default ChatHeader;
