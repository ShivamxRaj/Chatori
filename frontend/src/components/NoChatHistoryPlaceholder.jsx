import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const QUICK_MESSAGES = ["👋 Say Hello", "🤝 How are you?", "📅 Meet up soon?"];

const NoChatHistoryPlaceholder = ({ name }) => {
  const { sendMessage } = useChatStore();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none">
      <div className="size-16 rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/20 flex items-center justify-center mb-5 glow-violet-sm">
        <MessageCircleIcon className="size-8 text-violet-400" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">
        Start chatting with <span className="text-violet-400">{name}</span>
      </h3>
      <p className="text-slate-400 text-sm mb-6 max-w-xs">
        This is the beginning of your conversation. Send a message to get started!
      </p>

      <div className="h-px w-40 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-6" />

      <div className="flex flex-wrap gap-2 justify-center">
        {QUICK_MESSAGES.map((msg) => (
          <button
            key={msg}
            onClick={() => sendMessage({ text: msg.split(" ").slice(1).join(" ") })}
            className="px-4 py-2 text-xs font-medium text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full hover:bg-violet-500/20 transition-all"
          >
            {msg}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoChatHistoryPlaceholder;
