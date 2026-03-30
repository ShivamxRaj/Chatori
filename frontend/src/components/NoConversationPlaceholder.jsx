import { MessageCircleIcon, SparklesIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 select-none">
      {/* Floating chat bubbles decoration */}
      <div className="relative mb-8">
        <div className="absolute -top-6 -left-8 size-10 rounded-2xl bg-violet-600/20 border border-violet-500/20 flex items-center justify-center float-anim" style={{ animationDelay: "0s" }}>
          <MessageCircleIcon className="size-5 text-violet-400" />
        </div>
        <div className="absolute -top-4 -right-8 size-8 rounded-xl bg-fuchsia-600/20 border border-fuchsia-500/20 flex items-center justify-center float-anim" style={{ animationDelay: "1s" }}>
          <SparklesIcon className="size-4 text-fuchsia-400" />
        </div>

        {/* Main icon */}
        <div className="size-24 rounded-3xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/20 flex items-center justify-center glow-violet">
          <MessageCircleIcon className="size-12 text-violet-400" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-3">Select a conversation</h3>
      <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>

      <div className="mt-6 flex gap-2">
        <span className="auth-badge">End-to-end</span>
        <span className="auth-badge">Real-time</span>
        <span className="auth-badge">Secure</span>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
